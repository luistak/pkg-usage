export type Options = {
  fileGlobs: string;
  packages: string[];
  packageJsonCWD?: string;
};

export type FileUsage = {
  name: string;
  filePath: string;
  imports: Import[];
};

export type Usages =
  | JSXElementUsage[]
  | (CallExpressionUsage | PropertyAccessExpressionUsage | ValueUsage)[];

export type Import = {
  name: string;
  usages: Usages;
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
