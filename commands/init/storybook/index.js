import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import MyComponent from "[name]";

// The Storybook allows you to create individual demos for your components.

// Please keep in mind that Storybook support is highly experimental and *will* 
// undergo drastic change in future versions.

// https://storybook.js.org/basics/guide-react/

storiesOf("[name] Storybook Demo", module)
  .add('with clickable name', () => (
    <MyComponent onClickName={action("onClickName")} />
  ))
  .add('without clickable name', () => (
    <MyComponent />
  ));   
