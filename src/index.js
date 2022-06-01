


import { App } from 'octokit';

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import csv from 'csv-parser'
import * as fs from 'fs'




dotenv.config();

//const csv = csvall.createParser()

let app = new App({
    appId: process.env.GITHUB_APP_IDENTIFIER,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    
})



const { data } = await app.octokit.request("/app");
let arr=[]
let owner = "HimanshuBarak"
let repo  = "scrimba-clone"
let pck='react'
let vr ='17.02.0'

console.log(" hehe "+process.argv[2])
let repoSet = new Set()
let results = [];
fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    repoSet.add(results[0].name);
  });

  console.log(repoSet)
 // console.log(results[1].name)
/*
async function intialize(){
   const result =await app.octokit.auth({type:"app"}).then(auth => {

      return fetch(`https://api.github.com/repos/${owner}/${repo}/` + "installation", { headers: {
          authorization: `Bearer ${auth.token}`,
          accept: 'application/vnd.github.machine-man-preview+json',
      }})
   });
   
   const installationId = (await result.json()).id;
   
   const octokit = await app.getInstallationOctokit(installationId)
}

 
async function readpck(){
   const resp =await octokit.request("GET /repos/{owner}/{repo}/contents/{path}",{
      owner: 'HimanshuBarak',
      repo: 'scrimba-clone',
      path: 'package.json',
   })
   let obj =JSON.parse(Buffer.from(resp.data.content, 'base64'))
   
    obj = updatePackageJSONObject(obj, 'react', '16.0.5');
   //updating the object
   //console.log(obj)
   let branchname = await createRemoteBranch(octokit,owner,repo,pck,vr)
   //console.log(branchname)
   await commitUpdatedObject(octokit,owner,repo,branchname,obj)
   await createPR(octokit, owner, repo, branchname);
}

readpck()
*/








const commitUpdatedObject = async (octokit, repositoryOwner, repositoryName, remoteBranchName, updatedPackageJSONObject) => {
   // We get a SHA sum of the file in target branch
   const { sha } = (await octokit.rest.repos.getContent({
     owner: repositoryOwner,
     repo: repositoryName,
     path: 'package.json',
     ref: remoteBranchName,
   })).data;
 try {
     // And commit our changes to that branch
   await octokit.rest.repos.createOrUpdateFileContents({
      owner: repositoryOwner,
      repo: repositoryName,
      path: 'package.json',
      branch: remoteBranchName,
      message: remoteBranchName,
      sha,
      // Note, that content goes in the base64 encoding which is an update for upstream in GitHub API
      content: Buffer.from(JSON.stringify(updatedPackageJSONObject, null, 2)).toString('base64'),
    });
 } catch (error) {
    console.log(error.message);
 }
  
 };

 const createPR = async (octokit, owner, repo, newBranchName) => {
   // get the name of a default branch as it is not always a 'master'
   const { default_branch } = (await octokit.rest.repos.get({ owner, repo })).data;
   try {
      // and create PR to merge into it
   await octokit.rest.pulls.create({
      owner,
      repo,
      title: `Merge ${newBranchName} as new version of package available`,
      head: newBranchName,
      base: default_branch,
      maintainer_can_modify: true,
    });
   } catch (error) {
      console.log(error.message)
   }
   
 };
const createRemoteBranch = async (octokit, repositoryOwner, repositoryName, packageName, newVersion) => {
   // Firstly, we fetch commits to get SHA sum of the last commit, from which we will branch out.
   const commits = await octokit.rest.repos.listCommits({
     owner: repositoryOwner,
     repo: repositoryName,
   });
   const lastSHA = commits.data[0].sha;
   // Substitute variables to get new branch naem
   const newBranchName = `refs/heads/${packageName}-update-to-${newVersion}`;
   try {
      await octokit.rest.git.createRef({
         owner: repositoryOwner,
         repo: repositoryName,
         ref: newBranchName,
         sha: lastSHA,
       });
   } catch (error) {
      console.log(error.message)
   }
   // And call method to create branch on remote repository
  
   return newBranchName;
 };


const updatePackageJSONObject = (packageJSONObject, packageName, newVersion) => ({
   ...packageJSONObject,
   dependencies: {
     ...packageJSONObject.dependencies,
     [packageName]: newVersion,
   },
 });


console.log("authenticated as %s", data.name);


/*
for await (const { octokit, repository } of app.eachRepository.iterator()) {
  
   if(repoSet.has(repository.name)){
      const resp = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}",{
         owner: repository.owner.login,
         repo: repository.name,
         path: 'package.json',
      })
      let obj =JSON.parse(Buffer.from(resp.data.content, 'base64'))
      
      let v =obj.dependencies.react
      if(v.charAt(0) === '^' || v.charAt(0) === '~')
       v=v.substring(1)
      let ans =comapreVersion(v,"17.0.1") 
      //console.log(repository.url)
      arr.push({name:repository.name,Repository:repository.url,version:v,satisfied:ans})
      
      
   
    obj = updatePackageJSONObject(obj,pck,vr);
   //updating the object
   //console.log(obj)
  
   
      let branchname = await createRemoteBranch(octokit,repository.owner.login,repository.name,pck,vr)
   
   
   //console.log(branchname)
   await commitUpdatedObject(octokit,repository.owner.login,repository.name,branchname,obj)
   await createPR(octokit, repository.owner.login,repository.name, branchname);
   }

      
}

*/

//console.table(arr)
function comapreVersion(version1, version2) {
   //converting into array by splitting at .
   version1 = version1.split('.');
   version2 = version2.split('.');
   // Finding the max length of either array
   let length = Math.max(version1.length, version2.length);

   // Iterate over the length
   for (let i = 0; i < length; i++) {
     
       if ((+version1[i] || 0) < (+version2[i] || 0)) return false;
       if ((+version1[i] || 0) > (+version2[i] || 0)) return true;
   }
   return true;
}
