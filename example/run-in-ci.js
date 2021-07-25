const { getPackagesUsage } = require('../dist');

/**
 * You could use the result in many use cases example:
 *
 * - To fill an S3 with every usage of the desired builds
 * - To block the CI if the package is not being used
 */
const result = getPackagesUsage();
