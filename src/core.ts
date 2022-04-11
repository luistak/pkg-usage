import {
  ImportDeclaration,
  Project,
  ReferencedSymbol,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';

import {
  getJSXElementProps,
  getPackageVersion,
  getProperty,
  isCallExpression,
  isJSXElement,
  isPropertyAccessExpression,
  isValue,
  line,
  nonNullish,
  print,
} from './helpers';

import {
  PackageUsage,
  Options,
  JSXElementUsage,
  Import,
  CallExpressionUsage,
  PropertyAccessExpressionUsage,
  FileUsage,
} from './types';

const getDetailsFromImports = (importDeclaration: ImportDeclaration) => {
  const defaultReferences = importDeclaration
    .getDefaultImport()
    ?.findReferences();

  const namedReferences = importDeclaration
    .getNamedImports()
    .map((named) =>
      named.getLastChildByKindOrThrow(SyntaxKind.Identifier).findReferences()
    );

  const propsList = [
    ...getDetailsFromReferences(defaultReferences),
    ...namedReferences.map(getDetailsFromReferences).flat(),
  ];

  return propsList;
};

const getDetailsFromReferences = (
  references: ReferencedSymbol[] = []
): Import[] =>
  references.map((referencedSymbol) => ({
    name: referencedSymbol.getDefinition().getNode().getText(),
    usages: referencedSymbol
      .getReferences()
      .flatMap(
        (
          reference
        ):
          | JSXElementUsage
          | CallExpressionUsage
          | PropertyAccessExpressionUsage
          | never[] => {
          if (isValue(reference)) {
            return {
              line: line(reference),
              text: print(reference),
            };
          }

          if (isCallExpression(reference)) {
            return {
              line: line(reference),
              text: print(reference),
            };
          }

          if (isPropertyAccessExpression(reference)) {
            return {
              line: line(reference),
              property: getProperty(reference),
              text: print(reference),
            };
          }

          if (isJSXElement(reference)) {
            return {
              line: line(reference),
              props: getJSXElementProps(reference),
              text: print(reference),
            };
          }

          return [];
        }
      ),
  }));

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

  const imports = getDetailsFromImports(importDeclaration);

  return {
    name: sourceFile.getBaseName(),
    filePath: sourceFile.getFilePath(),
    imports,
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
