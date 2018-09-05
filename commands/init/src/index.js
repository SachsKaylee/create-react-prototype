import * as React from "react";

// This is a default index file created by create-react-prototype.
// To get started follw these steps:
//  $ npm run watch
//  $ cd example
//  $ npm run start
// Now your browser will open, and any changes you make to this file (or others) will be reloaded in real time!

// You may also want to take a look at /example/src/App.js to create a better playground for your library.

export const getLibraryName = () => "[name]";
export const getLibraryAuthor = () => "[fullname]";

export default ({ onClickName }) => (<span>
  Welcome to <em onClick={onClickName} style={{ cursor: onClickName && "pointer" }}>{getLibraryName()}</em>!
</span>);
