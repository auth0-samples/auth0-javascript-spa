# Custom Login

Demonstrates how to integrate Auth0 with your existing VanillaJS projects using your own HTML and CSS. Social login example included.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/vanillajs/02-custom-login).

## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g serve`
3. run `serve` in the directory of the project.

Go to `http://localhost:3000` and you'll see the app running :).

# Important Snippets

# 1. Add auth0.js dependency
```html
<!-- ===== ./index.html ===== -->
<head>
  ...
  <!-- Auth0 library -->
  <script src="//cdn.auth0.com/w2/auth0-7.0.3.min.js"></script>
  ...
</head>
```

# 2. Login with Auth0
```javascript
// ===== ./app.js =====
window.addEventListener('load', function() {
  var AUTH0_CLIENT_ID = '';
  var AUTH0_DOMAIN = '';
  var auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackOnLocationHash: true,
    callbackURL: 'http://YOUR_APP/callback',
  });

  document.getElementById('btn-login').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    auth0.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: username,
      password: password,
    }, function(err) {
      if (err) {
        alert("something went wrong: " + err.message);
      } else {
        show_logged_in(username);
      }
    });
  });
  ...
});
```

# 3. Register with Auth0
```javascript
// ===== ./app.js =====
...
document.getElementById('btn-register').addEventListener('click', function() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  auth0.signup({
    connection: 'Username-Password-Authentication',
    responseType: 'token',
    email: username,
    password: password,
  }, function(err) {
    if (err) alert("something went wrong: " + err.message);
  });
});
...
```

# 4. Social login (Google example)
```javascript
// ===== ./app.js =====
...
document.getElementById('btn-google').addEventListener('click', function() {
  auth0.login({
    connection: 'google-oauth2'
  }, function(err) {
    if (err) alert("something went wrong: " + err.message);
  });
});
...
```

# 5. Parse hash
```javascript
// ===== ./app.js =====
...
var parseHash = function() {
  var token = localStorage.getItem('id_token');
  if (null != token) {
    show_logged_in();
  } else {
    var result = auth0.parseHash(window.location.hash);
    if (result && result.idToken) {
      localStorage.setItem('id_token', result.idToken);
      show_logged_in();
    } else if (result && result.error) {
      alert('error: ' + result.error);
      show_sign_in();
    }
  }
};

parseHash();
...
```
