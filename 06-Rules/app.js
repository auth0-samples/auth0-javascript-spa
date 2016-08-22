window.addEventListener('load', function() {
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  document.getElementById('btn-login').addEventListener('click', function() {
    lock.show();
  });

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
        showUserProfile(profile);
      }
    });
  });

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (null != id_token) {
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      showUserProfile(user_profile);
    } // else: not authorized
  };

  var showUserProfile = function(profile) {
    document.getElementById('login').style.display = "none";
    document.getElementById('logged').style.display = "inline-block";
    document.getElementById('avatar').src = profile.picture;
    document.getElementById('name').textContent = profile.name;
    document.getElementById('email').textContent = profile.email;
    document.getElementById('nickname').textContent = profile.nickname;
    document.getElementById('created_at').textContent = profile.created_at;
    document.getElementById('updated_at').textContent = profile.updated_at;
    document.getElementById('country').textContent = profile.country;
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  parseHash();
});
