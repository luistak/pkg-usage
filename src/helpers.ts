import pkgup from 'pkg-up';

import { readFileSync } from 'fs';
import { ReferencedSymbol, ReferenceEntry, SyntaxKind } from 'ts-morph';
import { ExportType } from './types';

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

export const getExportType = (referencedSymbol: ReferencedSymbol) =>
  referencedSymbol.getDefinition().getDeclarationNode()?.getParentSyntaxList()
    ? ExportType.named
    : ExportType.default;

export const getJSXElementProps = (reference: ReferenceEntry) =>
  reference
    .getNode()
    .getParentOrThrow()
    .getFirstChildByKindOrThrow(SyntaxKind.JsxAttributes)
    .getChildrenOfKind(SyntaxKind.JsxAttribute)
    .map((attribute) =>
      attribute.getFirstChildByKindOrThrow(SyntaxKind.Identifier).getText()
    );

export const getProperty = (reference: ReferenceEntry) =>
  reference
    .getNode()
    .getParentOrThrow()
    .getLastChildByKindOrThrow(SyntaxKind.Identifier)
    .getText();

export const isJSXElement = (reference: ReferenceEntry) =>
  reference.getNode().getParentOrThrow().getKind() ===
    SyntaxKind.JsxOpeningElement ||
  reference.getNode().getParentOrThrow().getKind() ===
    SyntaxKind.JsxSelfClosingElement;

export const isValue = (reference: ReferenceEntry) =>
  reference.getNode().getParentOrThrow().getKind() ===
    SyntaxKind.VariableDeclaration ||
  reference.getNode().getParentOrThrow().getKind() ===
    SyntaxKind.ExpressionStatement ||
  reference.getNode().getParentOrThrow().getKind() === SyntaxKind.SyntaxList;

export const isCallExpression = (reference: ReferenceEntry) =>
  reference.getNode().getParentOrThrow().getKind() ===
  SyntaxKind.CallExpression;

export const isPropertyAccessExpression = (reference: ReferenceEntry) =>
  reference.getNode().getParentOrThrow().getKind() ===
  SyntaxKind.PropertyAccessExpression;

export const print = (reference: ReferenceEntry) =>
  reference.getNode().getParentOrThrow().getFullText();

export const line = (reference: ReferenceEntry) =>
  reference.getNode().getStartLineNumber();
