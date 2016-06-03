var lock = new Auth0Lock(
    // These properties are set in auth0-variables.js
    AUTH0_CLIENT_ID,
    AUTH0_DOMAIN
);

document.getElementById('btn-login').addEventListener('click', function () {
    lock.show({authParams: {scope: 'openid'}});
});

var hash = lock.parseHash(window.location.hash);

if (hash) {
    if (hash.error) {
        console.log("There was an error logging in", hash.error);
        alert('There was an error: ' + hash.error + '\n' + hash.error_description);
    } else {
        //save the token in the session:
        localStorage.setItem('id_token', hash.id_token);
    }
}
//retrieve the profile:
var id_token = localStorage.getItem('id_token');
if (id_token) {
    lock.getProfile(id_token, function (err, profile) {
        if (err) {
            return alert('There was an error geting the profile: ' + err.message);
        }
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('logged-in-box').style.display = 'inline';
        document.getElementById('nick').textContent = profile.nickname;

    });
}

document.getElementById('btn-api').addEventListener('click', function () {
    // Just call your API here. The header will be sent
});
