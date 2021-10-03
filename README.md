# 📦 pkg-usage

[![npm](https://img.shields.io/npm/v/pkg-usage.svg)](https://www.npmjs.com/package/pkg-usage)

## Installation

```sh
npm install windowed-observable

# or

yarn add windowed-observable
```

## Introduction

Have you ever wondered how your library is being used in other repositories? It's your lucky day because this package aims to solve it.

Given a few options you can gets details about how your library is being imported along with its version

## Usage

```js
import { getPackagesUsages } from 'pkg-usage';

const usages = getPackagesUsages({
  packages: ['react'],
  fileGlobs: `**/**.ts`,
});

console.log(usages);
```

Output

```json
[
  {
    count: 1,
    files: [
      {
        defaultImport: undefined,
        name: `${fileName}.ts`,
        namedImports: imports,
      },
    ],
    name: pkg,
    version,
  }
]
```

## Current features:

- The package version
- How many files are importing your `package`
- What are the default and named imports by file
