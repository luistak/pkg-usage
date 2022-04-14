#!/usr/bin/env node

const { getPackagesUsages } = require('pkg-usage');

const { Command } = require('commander');

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
  .option(
    '-cwd, --package-json-CWD <value>',
    'Directory to start from ex: -cwd "/path/to/start/from"'
  )
  .option(
    '-u, --analyze-import-usages',
    'Experimental feature that analyzes usages of imported JSXElements, function calls, object properties, and value usages'
  )
  .action(({ packages, fileGlobs, analyzeImportUsages, packageJsonCWD }) => {
    const usages = getPackagesUsages({
      packages,
      fileGlobs,
      analyzeImportUsages,
      packageJsonCWD,
    });

    console.log(JSON.stringify(usages, undefined, 2));
  });

program.parse(process.argv);
