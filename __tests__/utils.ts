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

function word() {
  return f.hacker.noun().replace(/ |-/g, '');
}

function capitalize(word: string) {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

function generatePropList(props: string[]) {
  return props.map((prop) => `${prop}="${prop}"`).join(' ');
}

function jsxElement(value: string, line: number) {
  const props = mockUniqueList(() => word().toLowerCase());
  return [
    {
      name: value,
      usages: [
        {
          line: line + 2,
          props,
          text: `<${value} ${generatePropList(props)}/>`,
        },
      ],
    },
    `function ${capitalize(word())}() { return (<${value} ${generatePropList(
      props
    )}/>)}`,
  ];
}

function propertyAccess(value: string, line: number) {
  const property = word();
  return [
    {
      name: value,
      usages: [{ line: line + 2, property, text: `\n${value}.${property}` }],
    },
    `${value}.${property}`,
  ];
}

function callExpression(value: string, line: number) {
  return [
    { name: value, usages: [{ line: line + 2, text: `\n${value}()` }] },
    `${value}()`,
  ];
}

function valueUsage(value: string, line: number) {
  return [
    { name: value, usages: [{ line: line + 2, text: `\n${value};` }] },
    `${value};`,
  ];
}

const possibleUsages = [propertyAccess, callExpression, valueUsage, jsxElement];

function mockTSFile(pkgName: string, imports: string[]) {
  const importSection = `import { ${imports.join(', ')} } from '${pkgName}';`;

  const usages = imports.map((entry, index) =>
    possibleUsages[index % possibleUsages.length](entry, index)
  );

  const mockedImports = usages.map((data) => data[1]);

  return {
    file: [importSection, ...mockedImports].join('\n'),
    imports: usages.map((data) => data[0]),
  };
}

export function mockPackageUsageFile(customData?: string) {
  const importNames = mockUniqueList(() => capitalize(word()));
  const fileName = f.datatype.uuid();
  const pkg = f.hacker.noun();
  const version = f.system.semver();

  const { file, imports } = mockTSFile(pkg, importNames);
  // Mocked with random data to generate a resilient test
  const data = customData ?? file;
  writeFile(`${fileName}.tsx`, data);

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
    imports: !customData ? imports : undefined,
    fileName,
    pkg,
    version,
  };
}
