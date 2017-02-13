var request = require("request");
var fs = require('fs');
var GITHUB_USER = 'bernardofcs';
var GITHUB_TOKEN = '868e404fd7917d1db463515c8a803c39ee6556d5';

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  // request.get('https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors')
  //   .on('error', function (err) {                                   // Note 2
  //     throw err;
  //   })
  //   .on('response', function(response){
  //     cb(response);
  //   })
  console.log(requestURL);
}

getRepoContributors('jquery', 'jquery', function(err, result){
  console.log('Errors: ' + err);
  console.log('Result: ' + result);
})
