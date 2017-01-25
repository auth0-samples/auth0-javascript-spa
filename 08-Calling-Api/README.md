# Calling API

This example shows how to make authenticated API calls by adding the `Authorization` header to each XMLHttpRequest of your VanillaJS application.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/vanillajs/08-calling-apis)

## Before running the example

Make sure that you have both the `Client ID` and `Client Secret`in the `auth0-variables.js` file. You can find that information in the settings section of your Auth0 Client. Also, make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/vanillajs/01-login#before-starting)

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
  <script src="http://cdn.auth0.com/js/lock/10.7.3/lock.min.js"></script>
  ...
</head>
```

## 2. Configure your XMLHttpRequest object to make authenticated requests

```javascript
/* ===== ./app.js ===== */
...
var authenticate_request = function(xhr) {
  var id_token = localStorage.getItem('id_token');
  xhr.setRequestHeader('Authorization', 'Bearer ' + id_token);
};
...
```
