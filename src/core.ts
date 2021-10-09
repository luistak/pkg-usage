import { Project, SourceFile } from 'ts-morph';

import { getPackageVersion, nonNullish } from './helpers';
import { FileUsage, PackageUsage, Options } from './types';

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
    filePath: sourceFile.getFilePath(),
    defaultImport: defaultImport?.getText(),
    namedImports: namedImports.map((a) => a.getName()),
  };
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
      .filter(nonNullish);

    return {
      name: pkg,
      version: getPackageVersion(pkg, packageJsonCWD),
      count: fileUsages.length,
      files: fileUsages,
    };
  });

  return result;
}
