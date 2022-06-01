

const { App } = require('@octokit/app');
const fetch  =  require('node-fetch');
const dotenv =  require('dotenv');

dotenv.config();

let app = new App({
    appId: process.env.GITHUB_APP_IDENTIFIER,
    privateKey: process.env.GITHUB_PRIVATE_KEY
})


const { data } = await app.octokit.request("/app");
console.log("authenticated as %s", data.name);

for await (const { octokit, repository } of app.eachRepository.iterator()) {
  await octokit.request("POST /repos/{owner}/{repo}/dispatches", {
    owner: repository.owner.login,
    repo: repository.name,
    event_type: "my_event",
  });
}