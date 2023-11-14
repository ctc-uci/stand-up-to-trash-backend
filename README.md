# npo-backend-template
This template will be used to create all NPO backend repos

## Setting up development environment

To start working on with this project, follow these steps:
1. Install the [EditorConfig plugin](https://editorconfig.org/#download) for your IDE.
1. Add the `.env` file stored in your projects Google Drive folder to the root of the project.
1. Install NodeJS and yarn following the [instructions here](https://classic.yarnpkg.com/lang/en/docs/install).
1. Navigate to the project folder in your terminal and run `yarn` to install required packages.

## Project branching structure

Due to complications with some of the GitHub Actions this project uses, the git branch structure is non-standard.

1. `dev`: This is the main branch of the project. All PRs should be merged into this branch, as if it was "main".
1. `main`: This is the "production-ready" branch of the project; `dev` should only be merged into `main` when it is at a presentable state.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode, with hot-reload support from [nodemon](https://github.com/remy/nodemon).\
The server will be accessible from http://localhost:3001, and will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn format`

Formats `.js` files with Prettier.\
See the [Prettier docs](https://prettier.io/docs/en/index.html) for more information.

## ESLint and Prettier

This project uses ESLint and Prettier to enforce the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

### ESLint Plugins

Currently, the following ESLint plugins are installed:
1. [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)

Visit the links to learn more about each plugin.

### Configuration

The configuration for ESLint is inside the `.eslintrc.json` file, located in the root of the project. Learn more about ESLint [here](https://eslint.org/).

The configuration for Prettier is inside the `.prettierrc` file, located in the root of the project. Learn more about Prettier [here](https://prettier.io/docs/en/index.html).

## Husky and lint-staged

This project uses lint-staged and husky to run ESLint checks before all commits.

### Skipping pre-commit checks

Use the `--no-verify` option to skip pre-commit checks, but please note that this is **strongly discouraged**. 

### Configuration

The configuration for lint-staged is inside the `lint-staged` object inside of `package.json`. Learn more about lint-staged [here](https://github.com/okonet/lint-staged).

The configuration for husky is in the `.husky` directory, located in the root of the project. Learn more about husky [here](https://typicode.github.io/husky/).


## Learn more about Node and ExpressJS

You can learn about Node [here](https://nodejs.org/en/).

To learn about express, check out the this express tutorial [here](https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm).