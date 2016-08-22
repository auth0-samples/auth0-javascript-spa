window.addEventListener('load', function() {
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
  var btn_login = document.getElementById('btn-login');

  if (btn_login) {
    btn_login.addEventListener('click', function() {
      lock.show();
    });
  }

  document.getElementById('btn-logout').addEventListener('click', function() {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function (err, profile) {
      if (err) {
        // Remove expired token (if any)
        localStorage.removeItem('id_token');
        // Remove expired profile (if any)
        localStorage.removeItem('profile');
        return alert('There was an error getting the profile: ' + err.message);
      } else {
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        route();
      }
    });
  });

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
});
