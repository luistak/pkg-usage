export type Options = {
  fileGlobs: string;
  packages: string[];
  packageJsonCWD?: string;
  analyzeImportUsages?: boolean;
};

export type FileUsage = {
  name: string;
  filePath: string;
  imports: Import[];
};

export enum ExportType {
  named = 'named',
  default = 'default',
}

export type Usages =
  | JSXElementUsage[]
  | (CallExpressionUsage | PropertyAccessExpressionUsage | ValueUsage)[];

export type Import = {
  name: string;
  type: ExportType;
  usages?: Usages;
};

export type PackageUsage = {
  name: string;
  count: number;
  files?: FileUsage[];
  version?: string;
};

export type JSXElementUsage = {
  line: number;
  props: string[];
  text: string;
};

export type CallExpressionUsage = {
  line: number;
  text: string;
};

export type ValueUsage = {
  line: number;
  text: string;
};

export type PropertyAccessExpressionUsage = {
  line: number;
  property: string;
  text: string;
};
