
<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.comHimanshuBarak/Package-Updater">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Package Updater</h3>

  <p align="center">
    A CLI tool built in Node js to check and update dependency version in github Repositories
    <br />
   
  </p>
</div>





<!-- ABOUT THE PROJECT -->
## About The Project



A CLI tool for updating dependencies in github repositories

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With


* [Node.js](https://node.org/)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites


* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

 
1. Clone the repo
   ```sh
   git clone https://github.com/dyte-submissions/dyte-vit-2022-HimanshuBarak.git
   ```
2.Install NPM packages
   ```sh
   npm install
 ```
3. You will need to create a github token for your account. Once the token is generated you can create .env file and set the token as follows

   ```sh
    GITHUB_TOKEN = "the_token_you_generated"
   ```



<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Using the following commands to run the tool 

To check package verison
```sh
 node index.js -i input.csv axios@0.24.0 
 ```
 
For updation

```sh
 node index.js -i input.csv axios@0.24.0 -update
```
<p align="right">(<a href="#top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/HimanshuBarak/Package-Updater.svg?style=for-the-badge
[contributors-url]: https://github.com/HimanshuBarak/Package-Updater/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/HimanshuBarak/Package-Updater.svg?style=for-the-badge
[forks-url]: https://github.com/HimanshuBarak/Package-Updater/network/members
[stars-shield]: https://img.shields.io/github/stars/HimanshuBarak/Package-Updater.svg?style=for-the-badge
[stars-url]: https://github.com/HimanshuBarak/Package-Updater/stargazers
[issues-shield]: https://img.shields.io/github/issues/HimanshuBarak/Package-Updater.svg?style=for-the-badge
[issues-url]: https://github.com/HimanshuBarak/Package-Updater/issues
[license-shield]: https://img.shields.io/github/license/HimanshuBarak/Package-Updater.svg?style=for-the-badge
[license-url]: https://github.com/HimanshuBarak/Package-Updater/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/himanshubarak/
[product-screenshot]: images/screenshot.png
