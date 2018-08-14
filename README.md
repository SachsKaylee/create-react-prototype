# create-react-prototype

Create React libraries with no build configuration.

## Why?

* Setting up a build environment for every single small library gets **tedious, repetetive and difficult to maintain**.
* Having dozens of files just containing intructions on *how to compile* your library always seems seems overkill, when all you want is to simply **compile your ES6 React code to IE11 ES5**.
* Having tons of files unrelated to the library code itself **distracts from its true purpose**.

create-react-prototype intends to fix these issues by providing **a zero configuration** out of the box solutions for writing react libraries. There **won't be a single file related to your build process**, etc. in your project.

## Quick Start

Install `create-react-prototype` gobally:

```
$ npm i -g create-react-prototype
```

Create a new directory for your libaray:

```
$ mkdir my-library
$ cd my-project
```

And initalize the project:

```
$ create-react-prototype init
```

You'll now be prompted to set up the package.json, and then `create-react-prototype` will go ahead and set everything up for you.

Building/testing/releasing your library is rather simple with these three scripts:

```
$ npm run build
$ npm run test
$ npm run release
```

Ready more [here](todo://wiki).

## What is create-react-prototype **not**?

* You cannot write applications in create-react-prototype - We **output compiled ES5 & ES6 modules, not a bundle.js**.
* It is not suited for applications which require a complex tweakable build configuration. This library is **suited for small libraries** for which writing a traditional build environment is simply overkill.
  If your library has reaced a scope where you need manually tweakable build steps you will either want to take a look at [create-react-library](https://www.npmjs.com/package/create-react-library) or set up the configuration yourself.
* Unlike create-react-app this library **does not support ejecting**.
