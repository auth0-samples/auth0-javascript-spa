# Authorization

This example shows one of the ways of adding Authorization for a resource in your application. We have an `/admin.html` page, which is only accessible for users with an `admin` role and an `/user.html` page, only accessible for users with `user` role.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/vanillajs/07-authorization).

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

## 2. Check if user's role is `admin` or `user`

```javascript
/* ===== ./app.js ===== */
...
var isAdmin = function(profile) {
  if (profile &&
      profile.app_metadata &&
      profile.app_metadata.roles &&
      profile.app_metadata.roles.indexOf('admin') > -1) {
    return true;
  } else {
     return false;
  }
};

var isUser = function(profile) {
  if (profile &&
      profile.app_metadata &&
      profile.app_metadata.roles &&
      profile.app_metadata.roles.indexOf('user') > -1) {
    return true;
  } else {
     return false;
  }
};
...
```

## 3. Filter access

```javascript
/* ===== ./app.js ===== */
...
var route = function() {
  var id_token = localStorage.getItem('id_token');
  var current_location = window.location.pathname;
  if (id_token) {
    var profile = JSON.parse(localStorage.getItem('profile'));

    switch(current_location) {
      case "/":
        hide(document.getElementById('btn-login'));
        show(document.getElementById('btn-logout'));
        if (isAdmin(profile)) show(document.getElementById('btn-go-admin'));
        if (isUser(profile)) show(document.getElementById('btn-go-user'));
        break;
      case "/user.html":
        if (true != isUser(profile)) {
          window.location.href = "/";
        } else {
          show(document.querySelector('.container'));
          show(document.getElementById('btn-logout'));
          document.getElementById('nickname').textContent = profile.nickname;
        }
        break;
      case "/admin.html":
        if (true != isAdmin(profile)) {
          window.location.href = "/";
        } else {
          show(document.querySelector('.container'));
          show(document.getElementById('btn-logout'));
          document.getElementById('nickname').textContent = profile.nickname;
        }
        break;
    };
  } else { // user is not logged in.
    // Call logout just to be sure our local session is cleaned up.
    if ("/" != current_location) {
      logout();
    }
  }
};

var logout = function() {
  localStorage.removeItem('id_token');
  localStorage.removeItem('profile');
  window.location.href = "/";
};

var hide = function(element) {
  element.style.display = "none";
};

var show = function(element) {
  element.style.display = "inline-block";
};

route();
...
```
