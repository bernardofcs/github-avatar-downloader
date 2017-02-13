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
  request.get(options, function(error, response, body){
    var obj = JSON.parse(body);
    cb(error, obj);
  })
  .on('error', function(err) {
    throw err;
  });
}

getRepoContributors('jquery', 'jquery', function(err, result){
  console.log('Errors: ' + err);
  console.log('Result: ' + result);
  for(var user of result){
    console.log(user['avatar_url']);
  }
})

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err){
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
