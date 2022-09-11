// import compareVersion from "./compareVersion.js"

export default async function (octokit,repoName,packageName,userName){
    const result = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
       owner: userName,
       repo: repoName,
       path: 'package.json'
     })
     //extracting the package version
     let obj =JSON.parse(Buffer.from(result.data.content, 'base64'))
     let v =obj.dependencies[packageName]
          
          if(v.charAt(0) === '^' || v.charAt(0) === '~')
           v=v.substring(1)
       //   let ans =compareVersion(v,version) 
          //console.log(repository.url)
        //  arr.push({name:repoName,Repository:repoUrl,version:v,satisfied:ans})    
          
          return v
 }
 