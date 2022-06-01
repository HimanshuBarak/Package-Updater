




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


  module.exports = {
      updatePackageJSONObject,
      createRemoteBranch,
      createPR,
      commitUpdatedObject
  }