import { Project, SourceFile } from 'ts-morph';
import pkgup from 'pkg-up';

import { FileUsage, PackageUsage, Options } from './types';
import { readFileSync } from 'fs';

function getPackageUsage(
  pkg: string,
  sourceFile: SourceFile
): FileUsage | undefined {
  const importDeclaration = sourceFile.getImportDeclaration(
    (importDeclaration) => {
      const moduleSpecifier = importDeclaration
        .getModuleSpecifier()
        .getLiteralValue();

      return moduleSpecifier == pkg;
    }
  );

  if (!importDeclaration) {
    return undefined;
  }

  const namedImports = importDeclaration.getNamedImports();
  const defaultImport = importDeclaration.getDefaultImport();

  return {
    name: sourceFile.getBaseName(),
    defaultImport: defaultImport?.getText(),
    namedImports: namedImports.map((a) => a.getName()),
  };
}

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

function getPackageVersion(pkg: string, packageJsonCWD?: string) {
  const { dependencies, peerDependencies, devDependencies } =
    getPackageJson(packageJsonCWD);

  return (
    dependencies.get(pkg) ||
    devDependencies.get(pkg) ||
    peerDependencies.get(pkg)
  );
}

export function getPackagesUsages({
  packages,
  fileGlobs,
  packageJsonCWD,
}: Options): PackageUsage[] | undefined {
  const project = new Project();
  const sourceFiles = project.addSourceFilesAtPaths(fileGlobs);

  if (!sourceFiles.length) {
    throw new Error(`No files were found in this glob: ${fileGlobs}`);
  }

  const result = packages.map((pkg) => {
    const fileUsages = sourceFiles
      .map((sourceFile) => getPackageUsage(pkg, sourceFile))
      .filter(Boolean);

    return {
      name: pkg,
      version: getPackageVersion(pkg, packageJsonCWD),
      count: fileUsages.length,
      files: fileUsages,
    };
  });

  return result;
}
