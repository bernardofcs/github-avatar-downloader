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
      var repoName = repo['full_name'];
      starred.push(repoName);
    }

    cb(error, starred);
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
  })
  .on('end', function(){
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

if(process.argv.length === 4){ // Checks if there are 2 arguments from the command line
  if(checkEnv){                // Checks if .env file exists
    if(checkEnvInfo){          // Checks if .env file has github user and token

    }else{
      console.log('.env file is missing information.');
    }
  }else{
    console.log('.env file does not exist');
  }
}else{
  console.log('Exactly 2 arguments are required: GitHub User and Repo Name');
}

var m = 0;
getRepoContributors(process.argv[2], process.argv[3], function(err, result){ //main program flow
  var mostStarred = [];
  for(var j = 0; j < result.length; j++){
    getStarredRepos(result[j]['starred_url'], function(err2, starred){
      m++;
      for(var i = 0; i < starred.length; i++){
        mostStarred.push(starred[i]);
      }
      if(m === result.length){
       calculate(mostStarred);
      }
    });
  }
});

function calculate(arr){         //calculates the top 5 starred repos
  var a = [], b = [], prev;
  var countStar = [];
  arr.sort();
  for(var i = 0; i < arr.length; i++){
      if ( arr[i] !== prev ) {
          a.push(arr[i]);
          b.push(1);
      } else {
          b[b.length-1]++;
      }
      prev = arr[i];
  }

  for(var m = 1; m < a.length; m++){
    var obj = {name: a[m], count: b[m]};
    countStar.push(obj);
  }

  countStar.sort(function(a, b){
    if(a.count < b.count){
      return 1;
    }
    if(a.count > b.count){
      return -1;
    }
    return 0;
  });
  var mostStarred = countStar.slice(0, 5);
  console.log('Most starred repos: ');
  console.log(mostStarred);
}

function transformArr(orig) { //
  var newArr = [],
  counts = {},
  i, j, cur;
  for (i = 0, j = orig.length; i < j; i++) {
    cur = orig[i];
    if (!(cur.count in counts)) {
      counts[cur.count] = {count: cur.t, names: []};
      newArr.push(counts[cur.count]);
    }
      counts[cur.count].names.push(cur.name);
  }
  return newArr;
}

