if(!process.argv[3]){
  throw new Error('2 arguments required');  // Checks if there are 2 arguments from the command line
}

var request = require("request");
var fs = require('fs');
var GITHUB_USER = 'bernardofcs';
var GITHUB_TOKEN = '868e404fd7917d1db463515c8a803c39ee6556d5';

function downloadImageByURL(url, filePath) { //downloads an image and saves to a path
  request.get(url)
  .on('error', function(err){
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

function getRepoContributors(repoOwner, repoName, cb) { // gets the list of avatar urls from a repo through an api call
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/'
  + repoOwner + '/' + repoName + '/contributors'; // GitHub authentication and repo author/name to be requested
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHuv Avatar Downloader - Student Project'
    }
  }
  request.get(options, function(error, response, body){   // parses the body json object and sends to the callback
    var obj = JSON.parse(body);
    cb(error, obj);
  })
  .on('error', function(err) {
    throw err;
  });
}

getRepoContributors(process.argv[2], process.argv[3], function(err, result){
  for(var user of result){
    downloadImageByURL(user['avatar_url'], 'avatars/' + user['login']);   //saves each avatar image from a repo into a custom file
  }
})


