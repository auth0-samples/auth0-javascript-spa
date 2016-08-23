window.addEventListener('load', function() {
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    theme: {
      logo: "test-icon.png",
      primaryColor: "#b81b1c"
    },
    languageDictionary: {
      title: "My Company"
    }
  });

  document.getElementById('btn-login').addEventListener('click', function() {
    lock.show();
  });

  document.getElementById('btn-logout').addEventListener('click', function() {
    logout();
  })

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        // Handle error
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      display_user_profile(profile);
    });
  });

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        display_user_profile(profile);
      });
    }
  };

  var display_user_profile = function(profile) {
    document.getElementById('nickname').textContent = profile.nickname;
    document.getElementById('btn-login').style.display = "none";
    document.getElementById('avatar').src = profile.picture;
    document.getElementById('avatar').style.display = "inline-block";
    document.getElementById('btn-logout').style.display = "inline-block";
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
  };

  parseHash();
});
