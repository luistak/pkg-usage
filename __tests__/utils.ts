import { join, dirname } from 'path';
import { cwd } from 'process';
import { writeFileSync, existsSync, mkdirSync, rmdirSync } from 'fs';
import f from 'faker';

export const MOCKS_DIR = '__mocks__';
export const MOCKS_DIR_CWD = join(join(cwd(), MOCKS_DIR));

function writeFile(fileName: string, data: string) {
  const path = `${MOCKS_DIR}/${fileName}`;

  if (!existsSync(dirname(path))) {
    mkdirSync(dirname(path));
  }

  writeFileSync(join(cwd(), path), data);
}

export function cleanupMockFiles() {
  rmdirSync(MOCKS_DIR, { recursive: true });
}

function mockUniqueList<T, U>(
  // eslint-disable-next-line no-unused-vars
  mapFn: (value: T, index: number, array: T[]) => U
) {
  return new Array(f.datatype.number({ min: 2, max: 10 }))
    .fill('')
    .map(mapFn)
    .filter((value, index, self) => self.indexOf(value) === index);
}

export function mockPackageUsageFile(customData?: string) {
  const imports = mockUniqueList(() => f.hacker.noun().replace(/ |-/g, ''));
  const fileName = f.datatype.uuid();
  const pkg = f.hacker.noun();
  const version = f.system.semver();

  // Mocked with random data to generate a resilient test
  const data = customData ?? `import { ${imports.join(', ')} } from '${pkg}';`;
  writeFile(`${fileName}.ts`, data);

  writeFile(
    'package.json',
    JSON.stringify({
      name: 'example',
      version: '1.0.0',
      main: 'index.js',
      author: 'Luis Takahashi',
      license: 'MIT',
      dependencies: {
        [pkg]: version,
      },
    })
  );

  return {
    imports,
    fileName,
    pkg,
    version,
  };
}
