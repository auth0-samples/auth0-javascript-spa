window.addEventListener('load', function() {
  var login_div = document.getElementById('login');
  var logged_div = document.getElementById('logged');

  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  document.getElementById('btn-login').addEventListener('click', function() {
    lock.show();
  });

  document.getElementById('btn-logout').addEventListener('click', function() {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    localStorage.setItem('id_token', authResult.idToken);
    lock.getProfile(authResult.idToken, function(err, profile) {
      if (err) {
        return alert("There was an error getting the profile: " + err.message);
      } else {
        localStorage.setItem('profile', JSON.stringify(profile));
        document.getElementById('nickname').textContent = profile.nickname;
        login_div.style.display = "none";
        logged_div.style.display = "inline-block";
      }
    });
  });

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      document.getElementById('nickname').textContent = user_profile.nickname;
      logged_div.style.display = "inline-block";
      login_div.style.display = "none";
    } // else: not authorized
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  var authenticate_request = function(xhr) {
    var id_token = localStorage.getItem('id_token');
    xhr.setRequestHeader('Authorization', 'Bearer ' + id_token);
  };

  parseHash();
});
