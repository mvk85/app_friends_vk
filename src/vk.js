function login() {
    return new Promise((resolve) => {
        VK.init({
            apiId: 5906287
        });
        VK.Auth.login(result => {
            resolve(result);
        })
    })
}

function callAPI(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
}

function createFriendsList(friends) {
    var templateFn = require('./friend-item.hbs');

    return templateFn({
        friends: friends
    });
}

export {
    login,
    callAPI,
    createFriendsList
}