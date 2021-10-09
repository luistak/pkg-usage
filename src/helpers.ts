import pkgup from 'pkg-up';

import { readFileSync } from 'fs';

// istanbul ignore next
function getPackageJson(packageJsonCWD?: string) {
  const pkgJsonPath = pkgup.sync({ cwd: packageJsonCWD });

  const { dependencies, peerDependencies, devDependencies } = JSON.parse(
    readFileSync(pkgJsonPath!, 'utf8')
  );

  return {
    dependencies: new Map<string, string>(
      dependencies ? Object.entries(dependencies) : undefined
    ),
    peerDependencies: new Map<string, string>(
      peerDependencies ? Object.entries(peerDependencies) : undefined
    ),
    devDependencies: new Map<string, string>(
      devDependencies ? Object.entries(devDependencies) : undefined
    ),
  };
}

// istanbul ignore next
export function getPackageVersion(pkg: string, packageJsonCWD?: string) {
  const { dependencies, peerDependencies, devDependencies } =
    getPackageJson(packageJsonCWD);

  return (
    dependencies.get(pkg) ||
    devDependencies.get(pkg) ||
    peerDependencies.get(pkg)
  );
}

export function nonNullish<Value>(v: Value): v is NonNullable<Value> {
  return v !== undefined && v !== null;
}
