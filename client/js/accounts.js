Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
})

username = function () {
    var user = Meteor.user();
    var usernameLogin = null
    if (user) {
        if (user.username){
            usernameLogin = user.username;
        } else {
            usernameLogin = user.profile.name;
        }
    }
    return usernameLogin
}
