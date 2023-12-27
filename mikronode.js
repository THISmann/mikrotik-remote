var axios = require('axios');
var btoa = require('btoa');

var session_url = 'https://192.168.1.1/rest/ip/address/print';
var username = 'etienne';
var password = 'FUH1234';
var basicAuth = 'Basic ' + btoa(`${username}` + ':' + `${password}`);
console.log(basicAuth);
axios.post(session_url, {}, {
      headers: { 'Authorization': basicAuth }
}).then(function(response) {
      console.log('Authenticated', response);
}).catch(function(error) {
      console.log('Error on Authentication',error);
});


 