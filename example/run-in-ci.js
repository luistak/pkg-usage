const { getPackagesUsages } = require('../dist/src/index');

/**
 * You could use the result in many use cases example:
 *
 * - To fill an S3 with every usage of the desired builds
 * - To block the CI if the package is not being used
 */
const result = getPackagesUsages({
  packages: ['bla', '@scoped/package'],
  fileGlobs: './*{.ts,.tsx}',
  packageJsonCWD: './package.json',
  analyzeImportUsages: true,
});

console.log(JSON.stringify(result, null, 2));
