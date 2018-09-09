# create-react-prototype ![npm](https://img.shields.io/npm/v/create-react-prototype.svg)

Create, test & showcase React libraries with no build configuration. 📚

## Why?

* Setting up a build environment for every single small library gets **tedious, repetetive and difficult to maintain**.
* You should not have to write dozens of configuration files just to **compile your ES6 React code to ES5**.
* Having tons of files unrelated to the library code itself **distracts from its true purpose**.

create-react-prototype intends to fix these issues by providing **a zero configuration** out of the box solution for writing react libraries. There **won't be a single file related to your build process**, etc. in your library.

## Features

* Compile ES5 to ES6
* Transpile React to valid JavaScript
* Unit Testing with Jest integrated
* Linting with ESLint integrated
* Storybook to showcase your components integrated
* Example create-react-app project integrated

## Quick Start

If you are a visual learner you can find a video tutorial here: https://www.youtube.com/watch?v=XwdJaKLfFK4

Install `create-react-prototype` globally:

```
$ npm i -g create-react-prototype
```

Create a new directory for your libaray and initialize the project in it:

```
$ mkdir my-library
$ cd my-library
$ create-react-prototype init
```

You'll now be prompted to set up the package.json, and then `create-react-prototype` will go ahead and set everything up for you.

Building/testing/releasing your library is rather simple with these scripts:

```
$ npm run build
$ npm run watch
$ npm run test
$ npm run pack
$ npm run release
```

If you cd to `example` a create-react-app stands ready to be used, with your library already installed:

```
$ npm run watch
$ cd example
$ npm run start
```

Read more [in the wiki](https://github.com/PatrickSachs/create-react-prototype/wiki).

## What is create-react-prototype **not**?

* You cannot write applications in create-react-prototype - We **output compiled ES5 modules, not a bundle.js**.
* It is not suited for applications which require a complex tweakable build configuration. This library is **suited for small libraries** for which writing a traditional build environment is simply overkill.
  If your library has reached a scope where you need manually tweakable build steps you will either want to take a look at [create-react-library](https://www.npmjs.com/package/create-react-library) or set up the configuration yourself.
* Unlike create-react-app this library **does not support ejecting**.
