# 📦 pkg-usage

[![npm](https://img.shields.io/npm/v/pkg-usage.svg)](https://www.npmjs.com/package/pkg-usage)

## Installation

```sh
npm install pkg-usage

# or

yarn add pkg-usage
```

## Introduction

Have you ever wondered how your library is being used in other repositories? It's your lucky day because this package aims to solve it.

Given a few options you can gets details about how your library is being imported along with its version

## Usage

```js
import { getPackagesUsages } from 'pkg-usage';

const usages: PackageUsage[] = getPackagesUsages({
  packages: ['react'],
  fileGlobs: `**/**.ts`,
});

console.log(usages);
```

Package Usage types

```ts
export type FileUsage = {
  name: string;
  filePath: string;
  defaultImport: string | undefined;
  namedImports: string[];
};

export type PackageUsage = {
  name: string;
  count: number;
  files?: FileUsage[];
  version?: string;
};
```

## CLI usage

| Options                  | Description                          | Example                                        |
| ------------------------ | ------------------------------------ | ---------------------------------------------- |
| -p, --packages           | Packages to analyze                  | -p vue,vuex or --packages="react,redux"        |
| -f, --file-globs         | Files to analyze based on file globs | -f "_.(ts\|tsx)" or --file-globs="_.(js\|jsx)" |
| -cwd, --package-json-CWD | Directory to start from              | -cwd "/path/to/start/from"                     |

### npx

[`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is a package runner tool

```bash
npx pkg-usage -p "react,redux" -f "**/*.(ts|tsx)"
```

Or

```bash
npx pkg-usage --packages="vue,vuex" --file-globs="**/*.(js|jsx)"
```

If you use npm 5.1 or earlier, you can't use npx. Instead, install it globally:

```bash
npm install -g pkg-usage
```

Now you can run:

```bash
pkg-usage -p "react,redux" --f "**/*.(ts|tsx)"
```
