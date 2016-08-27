window.addEventListener('load', function() {
  var user_id = null;

  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    additionalSignUpFields: [{
      name: "address",                              // required
      placeholder: "Enter your address",            // required
      icon: "./address_icon.png",                   // optional
      validator: function(value) {                  // optional
        // only accept addresses with more than 10 characters
        return value.length > 10;
      }
    }]
  });

  document.getElementById('btn-login').addEventListener('click', function() {
    lock.show();
  });

  document.getElementById('btn-edit').addEventListener('click', function() {
    document.getElementById('edit_profile').style.display = "block";
    document.getElementById('login').style.display = "none";
    document.getElementById('logged').style.display = "none";
  });

  document.getElementById('btn-edit-submit').addEventListener('click', function() {
    var user_address = document.getElementById('edit_address').value;
    var url = 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id;
    var data = JSON.stringify({ user_metadata: {address: user_address} });
    var xhr = new XMLHttpRequest();
    xhr.open('PATCH', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization',
                         'Bearer ' + localStorage.getItem('id_token'));
    xhr.onload = function() {
      if (xhr.status == 200) {
        localStorage.setItem('profile', xhr.responseText);
        showUserProfile(JSON.parse(xhr.responseText));
      } else {
        alert("Request failed: " + xhr.statusText);
      }
    };
    xhr.send(data);
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
    // Editing purposes only
    user_id = profile.user_id;
    document.getElementById('login').style.display = "none";
    document.getElementById('logged').style.display = "block";
    document.getElementById('edit_profile').style.display = "none";
    document.getElementById('avatar').src = profile.picture;
    document.getElementById('name').textContent = profile.name;
    document.getElementById('email').textContent = profile.email;
    document.getElementById('nickname').textContent = profile.nickname;
    document.getElementById('created_at').textContent = profile.created_at;
    document.getElementById('updated_at').textContent = profile.updated_at;
    if (profile.hasOwnProperty('user_metadata')) {
      document.getElementById('address').textContent = profile.user_metadata.address;
      document.getElementById('edit_address').value = profile.user_metadata.address;
    }
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  parseHash();
});
