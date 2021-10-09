#!/usr/bin/env node

// const { getPackagesUsages } = require('pkg-usage');
const { Command } = require('commander');
const { getPackagesUsages } = require('../dist/src');

const program = new Command();

function commaSeparatedList(value) {
  return value.split(',');
}

program
  .requiredOption(
    '-p, --packages <items>',
    'Packages to analyze ex: -p vue,vuex or --packages="react,redux"',
    commaSeparatedList
  )
  .requiredOption(
    '-f, --file-globs <value>',
    'Files to analyze based on file globs ex: -f "**/*.(ts|tsx)" or --file-globs="**/*.(js|jsx)"'
  )
  .action(({ packages, fileGlobs }) => {
    const usages = getPackagesUsages({
      packages,
      fileGlobs,
    });

    console.log(JSON.stringify(usages, undefined, 2));
  });

program.parse(process.argv);
