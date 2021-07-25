export type Package = {
  name: string;
};
export type Config = {
  dryRun?: boolean;
  fileGlobs: string;
  packages: Package[];
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
};
