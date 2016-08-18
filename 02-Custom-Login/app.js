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

  document.getElementById('btn-google').addEventListener('click', function() {
    auth0.login({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });

  document.getElementById('btn-logout').addEventListener('click', function() {
     localStorage.removeItem('id_token');
     window.location.href = "/";
  })

  var show_logged_in = function(username) {
    document.querySelector('form.form-signin').style.display = "none";
    document.querySelector('div.logged-in').style.display = "block";
  };

  var show_sign_in = function() {
    document.querySelector('div.logged-in').style.display = "none";
    document.querySelector('form.form-signin').style.display = "block";
  };

  var parseHash = function() {
    var token = localStorage.getItem('id_token');
    if (token) {
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

});
