/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

const fs = require('fs-extra');

//
// I want to switch our current public domain to this repo and use it deploy system,
// hence moving new webisite into a subfolder and an old one to root.
//
exports.onPostBuild = function () {
  // Store gatsby files in public/new insteaad of public.
  fs.renameSync(path.join(__dirname, 'public'), path.join(__dirname, 'public-new'));
  fs.mkdirSync(path.join(__dirname, 'public'));
  fs.renameSync(path.join(__dirname, 'public-new'), path.join(__dirname, 'public', 'new'));

  // Copy few assets folder to root as their callers will try find that files both with and
  // without pathPrefix.
  ['lottie-assets', 'fonts', 'page-data'].forEach((dir) => {
    fs.copySync(path.join(__dirname, 'public', 'new', dir), path.join(__dirname, 'public', dir));
  });

  // Copy current website to public/.
  fs.readdirSync(path.join(__dirname, 'terminal')).forEach((file) => {
    console.log(file);
    fs.copyFileSync(path.join(__dirname, 'terminal', file), path.join(__dirname, 'public', file));
  });
};
