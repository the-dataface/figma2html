# Contributing

## Table of Contents

- [Contributing](#contributing)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Getting started](#getting-started)
    - [Clone this repo](#clone-this-repo)
    - [Install dependences](#install-dependences)
    - [Build plugin](#build-plugin)
    - [Import plugin](#import-plugin)
    - [Run plugin](#run-plugin)
  - [Making a Pull Request](#making-a-pull-request)

## Requirements

- [git](https://www.github.com/git-guides/install-git) - A version manager.
- [Node (Gallium)](nodejs.org/download/release/latest-gallium) - The JavaScript runtime, versioned at ^16.
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - A package manager.
- [Figma Desktop](https://www.figma.com/downloads/) - Required for running plug-ins in development.
- Knowledge of the [Figma API](https://www.figma.com/plugin-docs) and [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).
- (Optional) Knowledge of [Tailwind](https://tailwindcss.com)

## Getting started

### Clone this repo

```bash
git clone https://github.com/the-dataface/figma2html.git
```

### Install dependences

The following command with move you to the repository's local directory, set up the correct Node version, and install the dependencies:

```bash
cd figma2html
nvm use
npm install
```

### Build plugin

After making updates locally, run `npm run build` in a terminal to bundle the project. There should be a `build` folder with three files: `bundle.js`, `index.html`, `main.js`. There are required to run the plugin.

To watch for updates, run `npm run dev` in a terminal. This will start a server that will livereload the aforementioned files and let you develop while testing your Figma file.

### Import plugin

1. From Figma's top menu bar: `Plugins` > `Development` > `Import plugin from manifest`.
2. Select the `manifest.json` file in the cloned `figma2html` directory.

### Run plugin

Via shortcut:

1. `cmd + /` to open the quick actions bar
2. Type `figma2html` and hit enter on the plugin. You will see a _development_ tag next to the version in development.

Via menu:

1. From Figma's top menu: `Plugins` > `Development` > `figma2html`

Via resources:

1. `shift + I` top open the resources panel
2. Click `Plugins`
3. Search for `figma2html` and click run

## Making a Pull Request

- All pull requests should be made against the `main` branch.
- Code should be in working condition before a review is requested unless help is needed.
- Commits should follow the [conventional commits style](https://www.conventionalcommits.org/), which helps generate changelogs and ensure proper versioning.
