#!/usr/bin/env node

const { getPackagesUsages } = require('../dist/index');

function getOptionsFromArgs(options) {
  const argsMap = {
    '--packages': 'packages',
    '--file-globs': 'fileGlobs',
  };

  return options.reduce((acc, option) => {
    const [key, value] = option.split('=');

    if (value) {
      return { ...acc, [argsMap[key]]: value };
    }

    return acc;
  }, {});
}

async function run() {
  const args = process.argv.slice(2);

  const { packages, fileGlobs } = getOptionsFromArgs(args);

  const usages = getPackagesUsages({
    packages: packages.split(','),
    fileGlobs,
  });

  console.log(JSON.stringify(usages, undefined, 2));
}

run();
