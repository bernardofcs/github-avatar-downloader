var request = require("request");
var fs = require('fs');

function getRepoContributors(repoOwner, repoName, cb) {
  request.get('https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors')
    .on('error', function (err) {                                   // Note 2
      throw err;
    })
    .on('response', function(response){
      cb(response);
    })
}

getRepoContributors('jquery', 'jquery', function(err, result){
  console.log('Errors: ' + err;
  console.log('Result: ' + result);
})
