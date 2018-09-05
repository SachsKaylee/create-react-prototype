import { configure } from '@storybook/react';

const loadStories = () => require("../");

configure(loadStories, module);
