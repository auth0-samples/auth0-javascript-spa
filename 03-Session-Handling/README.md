# Session Handling

Show how to handle the session by storing and retrieving the session token with Auth0 + VanillaJS.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/vanillajs/03-session-handling).

## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g serve`
3. run `serve` in the directory of the project.

Go to `http://localhost:3000` and you'll see the app running :).

# Important Snippets

## 1. Add Lock dependency
```html
<!-- ===== ./index.html ===== -->
<head>
  ...
  <!-- Auth0 Lock script -->
  <script src="http://cdn.auth0.com/js/lock/10.1.0/lock.min.js"></script>
  ...
</head>
```

## 2. Save token on login
```javascript
/* ===== ./app.js ===== */
...
var AUTH0_CLIENT_ID = '';
var AUTH0_DOMAIN = '';
var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

...

lock.on("authenticated", function(authResult) {
  localStorage.setItem('id_token', authResult.idToken);
  ...
});
...
```

## 3. Check if user is authenticated
```javascript
/* ===== ./app.js ===== */
...
var init = function() {
  var id_token = localStorage.getItem('id_token');
  if (id_token) {
    ...
  }
};

...

init();
```

## 4. Logout
```javascript
/* ===== ./app.js ===== */
...
var logout = function() {
  localStorage.removeItem('id_token');
  window.location.href = "/";
};
...
```
