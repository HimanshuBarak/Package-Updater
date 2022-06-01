


import { App } from 'octokit';

import dotenv from 'dotenv';
import csv from 'csv-parser'
import * as fs from 'fs'


const repoSet = new Set()
let results = [];

dotenv.config();



let app = new App({
    appId: process.env.GITHUB_APP_IDENTIFIER,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    
})



const { data } = await app.octokit.request("/app");
let arr=[]


let update=false
const myArgs = process.argv.slice(2);

const pname = myArgs[2].split("@")
let packageName = pname[0]
let version =pname[1]
if(myArgs.length ===4 && myArgs[3]==='-update')
    update=true;

fs.createReadStream(myArgs[1])
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    readdata(results)
  });

  function readdata(arr)
  {
     arr.map(data =>repoSet.add(data.name))
     
  }
  





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



for await (const { octokit, repository } of app.eachRepository.iterator()) {
  
   if(repoSet.has(repository.name)){
      const resp = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}",{
         owner: repository.owner.login,
         repo: repository.name,
         path: 'package.json',
      })
      let obj =JSON.parse(Buffer.from(resp.data.content, 'base64'))
      
      let v =obj.dependencies[packageName]
      
      if(v.charAt(0) === '^' || v.charAt(0) === '~')
       v=v.substring(1)
      let ans =comapreVersion(v,version) 
      //console.log(repository.url)
      arr.push({name:repository.name,Repository:repository.url,version:v,satisfied:ans})
      
      
    if(update && !ans) {
      obj = updatePackageJSONObject(obj,packageName,version);
      let branchname = await createRemoteBranch(octokit,repository.owner.login,repository.name,packageName,version)
      await commitUpdatedObject(octokit,repository.owner.login,repository.name,branchname,obj)
      await createPR(octokit, repository.owner.login,repository.name, branchname);
    }
    
   }

      
}



console.table(arr)
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
