window.addEventListener('load', function() {
  var AUTH0_CLIENT_ID = '';
  var AUTH0_DOMAIN = '';
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  // buttons
  var btn_login = document.getElementById('btn-login');
  var btn_logout = document.getElementById('btn-logout');

  btn_login.addEventListener('click', function() {
    lock.show();
  });

  btn_logout.addEventListener('click', function() {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    localStorage.setItem('id_token', authResult.idToken);
    btn_login.style.display = "none";
    btn_logout.style.display = "inline-block";
  });

  var init = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      btn_login.style.display = "none";
      btn_logout.style.display = "inline-block";
    }
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
  };

  init();
});
