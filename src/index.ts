import { Project, SourceFile } from 'ts-morph';
import { CONFIG_FILE_NAME } from './constants';
import { Package } from './types';
import { readYamlConfig } from './utils';

function getPackageUsage(pkg: Package, sourceFile: SourceFile) {
  const importDeclaration = sourceFile.getImportDeclaration(
    (importDeclaration) => {
      const moduleSpecifier = importDeclaration
        .getModuleSpecifier()
        .getLiteralValue();

      return moduleSpecifier == pkg.name;
    }
  );

  if (!importDeclaration) {
    return undefined;
  }

  const namedImports = importDeclaration.getNamedImports();
  const defaultImport = importDeclaration.getDefaultImport();

  return {
    fileName: sourceFile.getBaseName(),
    defaultImport: defaultImport?.getText(),
    namedImports: namedImports.map((a) => a.getName()),
  };
}

export function getPackagesUsage() {
  const project = new Project();
  const { dryRun, packages, fileGlobs } = readYamlConfig();
  const sourceFiles = project.addSourceFilesAtPaths(fileGlobs);

  if (!sourceFiles.length) {
    throw new Error(
      `No files were found in this glob: ${fileGlobs}, please check your ${CONFIG_FILE_NAME} file`
    );
  }

  const result = packages.map((pkg) => {
    const usageByFile = sourceFiles
      .map((sourceFile) => getPackageUsage(pkg, sourceFile))
      .filter(Boolean);

    return {
      ...pkg,
      count: usageByFile.length,
      usageByFile,
    };
  });

  if (dryRun) {
    return console.log(result);
  }

  return result;
}
