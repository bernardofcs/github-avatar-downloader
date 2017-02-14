require('dotenv').config();
var request = require("request");
var fs = require('fs');
var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;


function downloadImageByURL(url, filePath) { //downloads an image and saves to a path
  request.get(url)
  .on('error', function(err){
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

function getStarredRepos(url, cb){
  var newUrl = url.replace('https://', '').replace('{/owner}{/repo}', '');
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@' + newUrl; // GitHub authentication and repo author/name to be requested
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHuv Avatar Downloader - Student Project'
    }
  }
  request.get(options, function(error, response, body){
    var obj = JSON.parse(body);
    var starred = [];
    for(var repo of obj){
      var repoName = repo['id'];
      if(!starred[repoName]){
        //starred[repoName] = {name: repoName, count: 1}
        starred.push({name: repoName, count: 1});
      }else{
        starred[repoName]['count'] += 1;
      }
    }

    cb(error, starred);
    //console.log(obj);
    //cb(error, obj);
  })
  .on('error', function(err){
    throw err;
  });
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
    cb(error, obj);                                       //callback function called
  })
  .on('error', function(err) {
    throw err;
  });
}

function checkEnv(){ // check if .env file exists
  return fs.existsSync('.env');
}

function checkEnvInfo(){
  if (process.env.GITHUB_USER && process.env.GITHUB_TOKEN){
    return true;
  }
  else{
    return false;
  }
}

var mostStarred = [];
if(process.argv.length === 4){ // Checks if there are 2 arguments from the command line
  if(checkEnv){                // Checks if .env file exists
    if(checkEnvInfo){          // Checks if .env file has github user and token
      getRepoContributors(process.argv[2], process.argv[3], function(err, result){ //main program flow
        var count = 0;
        for(var user of result){
          var starCount = 0;
          var arrMostStarred = getStarredRepos(user['starred_url'], function(err2, starred){
            console.log(starred);
            for(var repo in starred){
              var repoName = starred[repo];
              if(!mostStarred[repoName]){
                mostStarred[repoName] = {name: repoName, count: 1};
              }else{
                mostStarred[repoName]['count'] += 1;
              }
            }
            console.log(mostStarred);
          });
        }
        //console.log(mostStarred)
      });
    }else{
      console.log('.env file is missing information.');
    }
  }else{
    console.log('.env file does not exist');
  }
}else{
  console.log('Exactly 2 arguments are required: GitHub User and Repo Name');
}