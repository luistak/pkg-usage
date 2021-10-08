export type Options = {
  fileGlobs: string;
  packages: string[];
  packageJsonCWD?: string;
};

export type FileUsage = {
  name: string;
  defaultImport: string | undefined;
  namedImports: string[];
};

export type PackageUsage = {
  name: string;
  count: number;
  files?: (FileUsage | undefined)[];
  version?: string;
};
