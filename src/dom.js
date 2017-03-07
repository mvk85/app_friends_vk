function getList(list) {
    if (!list) {
        return;
    }

    let arList = [];

    for (let i = 0; i < list.length; i++) {
        arList.push(list[i]);
    }

    return arList;
}

function getSortList(list) {    
    let arList = getList(list);
    
    arList.sort(sortListFriends);
    
    return arList;
}

function sortListFriends(item1, item2) {
    let name1 = getName(item1);
    let name2 = getName(item2);

    if (name1 > name2) {
        return 1;
    } else if (name1 < name2) {
        return -1;
    }
    
    return 0;
}

function isMatches (str, value) {
    let st = str.toLowerCase();
    let val = value.toLowerCase();

    return st.indexOf(val) != -1 ? true : false;
}

function sortDomList(list, node) {
    let arList = getSortList(list);

    arList.forEach(elem => {
        node.appendChild(elem);
    });
}

function getName(elem) {
    return elem.querySelector('.window__list-friend-name').innerText;
}

function deleteItem(arr, item) {
    let name1 = getName(item);

    for (let i = 0; i < arr.length; i++) {
        let name2 = getName(arr[i]);

        if (name1 === name2) {
            arr.splice(i, 1);
            break;
        }
    }
}

function addItem(arr, item) {
    arr.push(item);
    arr.sort(sortListFriends);
}

function renderingList(options) {
    let cont = getContainers();
    let containerAllList = cont.all;
    let containerFilterList = cont.filter;
    let arrAll = options.listAll;
    let arrFilter = options.listFilter;

    if (!containerAllList || !containerFilterList) {
        return;
    }
    
    arrAll.sort(sortListFriends);
    arrFilter.sort(sortListFriends);

    if (options.filterFlag && options.filterValue) {
        if (options.filterFlag == 'all') {

            containerAllList.innerHTML = '';
            
            arrAll.forEach(elem => {
                if (isMatches(getName(elem), options.filterValue)) {
                    containerAllList.appendChild(elem);
                }
            });

        } else if (options.filterFlag == 'filter') {

            containerFilterList.innerHTML = '';

            arrFilter.forEach(elem => {
                if (isMatches(getName(elem), options.filterValue)) {
                    containerFilterList.appendChild(elem);
                }
            });

        }
    } else {

        containerAllList.innerHTML = '';
        containerFilterList.innerHTML = '';

        arrAll.forEach(elem => {
            containerAllList.appendChild(elem);
        });
        arrFilter.forEach(elem => {
            containerFilterList.appendChild(elem);
        });
    }
}

function getContainers() {
    let containerAllList = document.querySelector('#list_friends_all .window__list-block-items ul');
    let containerFilterList = document.querySelector('#list_friends_filter .window__list-block-items ul');
    
    return {
        all: containerAllList,
        filter: containerFilterList
    }
}

function showFilter(bShow) {
    let filterDiv = document.getElementById('filter');
    
    bShow ? filterDiv.style.display = 'block' : filterDiv.style.display = 'none';
}

export {
    getList,
    getSortList,
    sortDomList,
    deleteItem,
    addItem,
    renderingList,
    getContainers,
    showFilter
}