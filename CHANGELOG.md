# Changelog create-react-prototype

All notable changes to this library will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this library adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Legend:

* 🎉 Special release
* ✨ New feature
* 📃 Documentation
* 🔧 Fix/Change

Append GitHub @usernames to all bullet points.

## 1.2.0

* ✨ Added new `--dependency tgz` option for the init command @PatrickSachs.
* ✨ Added new `--dependency npm@...` option for the init command, where `...` is any possible version of create-react-prototype @PatrickSachs.
* ✨ Added a `--debug` option for all commands @PatrickSachs.
* 🔧 Updated the example to use react-scripts 2 @PatrickSachs.
* 🔧 Fixed banner containing a JSON object pointing to the repo instead of a string @PatrickSachs.
* 🔧 (Probably!) Fixed potential build error when using yarn @PatrickSachs.

## 1.1.1

* 🔧 Fix `publish` command when using yarn as package manager @PatrickSachs.

## 1.1.0

* ✨ Added `--packageManager` to the `init` command, allowing the use of yarn as package manager @PatrickSachs.
* 🔧 Changed Jest version to 22.4.3, which is required by the react-scripts for the example project, even when not using unit tests @PatrickSachs.

## 1.0.1

* 🔧 Added missing keywords to package.json for the NPM registry @PatrickSachs.

## 1.0.0

* 🎉 Initial release @PatrickSachs.
