function separateUserLists(arrAllUsers, arrIdsUsersFilter) {
    let arListFriendAll = [];
    let arListFriendFilter = [];

    for (let i = 0; i < arrAllUsers.length; i++) {
        let elem = arrAllUsers[i];
        
        if (arrIdsUsersFilter.indexOf(`${elem.id}`) != -1) {
            arListFriendFilter.push(elem);
        } else {
            arListFriendAll.push(elem);
        }
    }

    return {
        all: arListFriendAll,
        filter: arListFriendFilter
    }
}

export {
    separateUserLists
}