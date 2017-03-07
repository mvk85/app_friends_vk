import './css/style.scss';

import {
    login,
    callAPI,
    createFriendsList
} from './vk';

import {
    getList,
    sortDomList,
    deleteItem,
    addItem,
    renderingList,
    getContainers,
    showFilter
} from './dom';

import {
    separateUserLists
} from './assets'

let friendsDiv = document.getElementById('friends');
let filterDiv = document.getElementById('filter');
let curItemsFriendAll = [];
let curItemsFriendFilter = [];

// open window
friendsDiv.addEventListener('click', (event) => {
    let target = event.target;
    let containerItemsAll, containerItemsFilter;

    if (!target.classList.contains('friends__title-open')) {
        return;
    }
    
    if (!document.querySelector('#filter .window')) {
        let templateContainer = require('./container.hbs');

        filterDiv.innerHTML = templateContainer();
    }

    containerItemsAll = getContainers().all;
    containerItemsFilter = getContainers().filter;
    showFilter(true);

    login()
        .then(() => callAPI('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] }))
        .then(result => {
            let lisAll, lisFilter;

            if (localStorage.idsVKUser) {
                let idsUserFilter = JSON.parse(localStorage.idsVKUser);
                let sepLists = separateUserLists(result.items, idsUserFilter);

                containerItemsAll.innerHTML = createFriendsList(sepLists.all);
                containerItemsFilter.innerHTML = createFriendsList(sepLists.filter);
                lisAll = containerItemsAll.querySelectorAll('li');
                lisFilter = containerItemsFilter.querySelectorAll('li');
                sortDomList(lisAll, containerItemsAll);
                sortDomList(lisFilter, containerItemsFilter);
                curItemsFriendAll = getList(lisAll);
                curItemsFriendFilter = getList(lisFilter);
            } else {
                containerItemsAll.innerHTML = createFriendsList(result.items);
                lisAll = containerItemsAll.querySelectorAll('li');
                sortDomList(lisAll, containerItemsAll);
                curItemsFriendAll = getList(lisAll);
            }

            getContainers().all.addEventListener('mousedown', startDragDrop);
        })
        .catch(() => {
            alert('error open widow');
            showFilter(false);
        });
});

filterDiv.addEventListener('click', event => {
    let target = event.target;

    // add and delete button for friend list
    if (target.classList.contains('icon_button')) {
        event.preventDefault();

        let item = target.closest('.window__list-block-item');

        if (!item) {
            return;
        }

        if (target.closest('#list_friends_all')) {  //  add

            addItem(curItemsFriendFilter, item);
            deleteItem(curItemsFriendAll, item);
            renderingList({
                listAll: curItemsFriendAll,
                listFilter: curItemsFriendFilter
            });

        } else if (target.closest('#list_friends_filter')) {    //  delete

            addItem(curItemsFriendAll, item);
            deleteItem(curItemsFriendFilter, item);
            renderingList({
                listAll: curItemsFriendAll,
                listFilter: curItemsFriendFilter
            });
            
        }
    }

    if (target.tagName === 'INPUT') {
        target.addEventListener('keyup', filterList);
    }

    // save button
    if (target.classList.contains('window__bottom-save')) {
        let contFilter = getContainers().filter;
        let arListFilter = getList(contFilter.querySelectorAll('li'));
        let arIds = [];

        arListFilter.forEach(elem => {
            arIds.push(elem.dataset.id);
        });

        localStorage.idsVKUser = JSON.stringify(arIds);
        if (arIds.length == 0 && localStorage.idsVKUser) {
            localStorage.removeItem('idsVKUser');
        }
        showFilter(false);
    }

    // close button
    if (target.classList.contains('window__title-close')) {
        showFilter(false);
        event.preventDefault();
    }
});

function startDragDrop(event) {
    if (event.target.classList.contains('icon_button')) {
        return;
    }
    let ul = getContainers().all;
    let containerFilter = document.querySelector('#list_friends_filter');
    let coordFilter = containerFilter.getBoundingClientRect();
    let target = event.target;
    let li = target.closest('li.window__list-block-item');
    let clickMouse = { X: event.pageX, Y: event.pageY };
    let liBound = li.getBoundingClientRect();
    let shiftCoord = {
        X: clickMouse.X - liBound.left,
        Y: clickMouse.Y - liBound.top
    };
    let liClone;

    if (!li) {
        return;
    }

    getContainers().all.ondragstart = () => false;

    liClone = li.cloneNode(true);
    liClone.classList.add('hover_clone');

    li.style.width = liBound.width + 'px';
    li.style.height = liBound.height + 'px';

    filterDiv.addEventListener('mousemove', dragFriend);
    filterDiv.addEventListener('mouseup', dropFriend);

    function dragFriend(event) {
        if (!li.classList.contains('move_item')) {
            li.classList.add('move_item');
        }
        ul.insertBefore(liClone, li);
        li.style.left = (event.pageX - shiftCoord.X) + 'px';
        li.style.top = (event.pageY - shiftCoord.Y) + 'px';
    }

    function dropFriend(event) {
        if ( (event.pageX > coordFilter.left && event.pageX < coordFilter.right)
            && (event.pageY > coordFilter.top && event.pageY < coordFilter.bottom)) {

            addItem(curItemsFriendFilter, li);
            deleteItem(curItemsFriendAll, li);
            renderingList({
                listAll: curItemsFriendAll,
                listFilter: curItemsFriendFilter
            });

        }

        filterDiv.removeEventListener('mousemove', dragFriend);
        filterDiv.removeEventListener('mouseup', dropFriend);
        li.classList.remove('move_item');
        li.style.left = '';
        li.style.top = '';
        li.style.width = '';
        li.style.height = '';
        if (ul.contains(liClone)) {
            ul.removeChild(liClone);
        }
    }
}

function filterList() {
    let dataSearch = this.dataset.search;
    let value = this.value;

    if (value) {
        renderingList({
            listAll: curItemsFriendAll,
            listFilter: curItemsFriendFilter,
            filterFlag: dataSearch,
            filterValue: value
        })
    } else {
        renderingList({
            listAll: curItemsFriendAll,
            listFilter: curItemsFriendFilter
        })
    }

}