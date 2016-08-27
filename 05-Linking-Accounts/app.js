window.addEventListener('load', function() {
  var login_div = document.getElementById('login');
  var logged_div = document.getElementById('logged');

  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  // Lock instance to launch a login to obtain the secondary id_token
  var lockLink = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {params: {state: "linking"}},
    allowedConnections: ['Username-Password-Authentication', 'facebook', 'google-oauth2'],
    languageDictionary: { // allows to override dictionary entries
      title: "Link with:"
    }
  });

  document.getElementById('btn-login').addEventListener('click', function() {
    lock.show();
  });

  document.getElementById('btn-link-account').addEventListener('click', function() {
    lockLink.show();
  });

  document.getElementById('btn-logout').addEventListener('click', function() {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    // Every lock instance listen to the same event, so we have to check if
    // it's not the linking login here.
    if (authResult.state != "linking") {
      localStorage.setItem('id_token', authResult.idToken);
      lock.getProfile(authResult.idToken, function(err, profile) {
        if (err) {
          return alert("There was an error getting the profile: " + err.message);
        } else {
          localStorage.setItem('profile', JSON.stringify(profile));
          showUserIdentities(profile);
          // Linking purposes only
          localStorage.setItem('user_id', profile.user_id);
          login_div.style.display = "none";
          logged_div.style.display = "inline-block";
        }
      });
    }
  });

  lockLink.on("authenticated", function(authResult) {
    // Every lock instance listen to the same event, so we have to check if
    // it's not the linking login here.
    if (authResult.state == "linking") {
      // If it's the linking login, then do the link through the API.
      linkAccount(authResult.idToken);
    }
  });

  var linkAccount = function(id_token) {
    // Get user_id value stored at login step
    var user_id = localStorage.getItem('user_id');
    var url = 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id + '/identities';
    var data = JSON.stringify({ link_with: id_token });
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization',
                         'Bearer ' + localStorage.getItem('id_token'));
    xhr.onload = function() {
      if (xhr.status == 201) {
        fetchProfile();
      } else {
        alert("Request failed: " + xhr.statusText);
      }
    };
    xhr.send(data);
  };

  var unlinkAccount = function(identity) {
    // Get user_id value stored at login step
    var user_id = localStorage.getItem('user_id');
    var url = 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id + '/identities/' + identity.provider + '/' + identity.user_id;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization',
                         'Bearer ' + localStorage.getItem('id_token'));
    xhr.onload = function() {
      if (xhr.status == 200) {
        fetchProfile();
      } else {
        alert("Request failed: " + xhr.statusText);
      }
    };
    xhr.send();
  };

  var fetchProfile = function() {
    var id_token = localStorage.getItem('id_token');
    lock.getProfile(id_token, function(err, profile) {
      if (err) {
        return alert("There was an error getting the profile: " + err.message);
      } else {
        localStorage.setItem('profile', JSON.stringify(profile));
        showUserIdentities(profile);
      }
    });
  };

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (null != id_token) {
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      showUserIdentities(user_profile);
      logged_div.style.display = "inline-block";
      login_div.style.display = "none";
    } // else: not authorized
  };

  var bind_unlink_buttons = function() {
    var elements = document.querySelector('#linked-accounts-list')
                           .querySelectorAll('button.unlink-account');
    for (var i=0, len=elements.length; i < len; i++) {
      element = elements[i];
      element.addEventListener('click', function() {
        var identity = JSON.parse(element.getAttribute('data-identity'));
        unlinkAccount(identity);
      });
    }
  };

  var showUserIdentities = function(profile) {
    login_div.style.display = "none";
    logged_div.style.display = "inline-block";
    var linked_accounts = '';
    profile.identities.forEach(function(identity) {
      // Print all the identities but the main one (Auth0).
      if (profile.user_id != identity.provider + '|' + identity.user_id) {
        var identity_stringified = JSON.stringify(identity);
        var btn = "<button type='button' class='unlink-account' data-identity='" + identity_stringified + "'>Unlink</button>";
        linked_accounts +=
          '<li>' + identity.connection + ' ' + identity.profileData.name + ' ' + btn + '</li>';
      }
    });
    document.getElementById('linked-accounts-list').innerHTML = linked_accounts;
    bind_unlink_buttons();
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  parseHash();
});
