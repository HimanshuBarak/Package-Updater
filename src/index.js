import {Octokit} from 'octokit';
import dotenv from 'dotenv';
import csv from 'csv-parser'
import * as fs from 'fs'

import readRepo from './commands/readPackage.js'
import compareVersion from "./commands/compareVersion.js"
import updatePackage from './commands/updatePackage.js'

dotenv.config();


// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN});

// getauthenticated returns all the info about the user github profile (username,url,followers nd stuff)
const {data:user} = await octokit.rest.users.getAuthenticated();
const repoOwner = user.login

//reading from console and files
let update=false
const myArgs = process.argv.slice(2);
const pname = myArgs[2].split("@")
let packageName = pname[0]
let version =pname[1]
//check if the users has also asked for the updation of the package 
if(myArgs.length ===4 && myArgs[3]==='-update')
    update=true;

let arr =[]
let results = [];


//read the data ffrom the given csv file   
// the async await in this function just blows my mind till this day
fs.createReadStream(myArgs[1])
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async() => {
    
   // results.map(async(repo)=> await readRepo(repo.name,repo.repo))
     for(let i=0; i<results.length;i++){
      let v =  await readRepo(octokit,results[i].name,packageName,repoOwner) 
      let ans =compareVersion(v,version) 
      let pullUrl
      if(update && !ans)
       pullUrl =updatePackage(octokit,repoOwner,results[i].name,packageName,version)
       arr.push({name:results[i].name,Repository:results[i].url,version:v,satisfied:ans,PullRequestUrl:pullUrl})  
     }
     console.table(arr);
  })
  



