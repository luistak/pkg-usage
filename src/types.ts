export type Package = {
  name: string;
};
export type Config = {
  dryRun?: boolean;
  fileGlobs: string;
  packages: Package[];
};
