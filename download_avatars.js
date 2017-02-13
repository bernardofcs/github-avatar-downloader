var request = require("request");
var fs = require('fs');
var GITHUB_USER = 'bernardofcs';
var GITHUB_TOKEN = '868e404fd7917d1db463515c8a803c39ee6556d5';

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/'
  + repoOwner + '/' + repoName + '/contributors'; // GitHub authentication and repo author/name to be requested
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHuv Avatar Downloader - Student Project'
    }
  }
  request(options, cb);
}

getRepoContributors('jquery', 'jquery', function(error, response, body){
  console.log(response.statusCode);
    if(!error && response.statusCode === 200){
      console.log(body)
    }
})
