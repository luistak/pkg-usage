import { join } from 'path';
import { cwd } from 'process';
import { readFileSync } from 'fs';

import yaml from 'js-yaml';

import { CONFIG_FILE_NAME } from './constants';
import { Config } from './types';

export function readFile(path: string) {
  return readFileSync(join(cwd(), path), 'utf8');
}

export function readYamlConfig(): Config {
  try {
    return yaml.load(readFile(CONFIG_FILE_NAME)) as unknown as Config;
  } catch (error) {
    throw new Error(
      `No ${CONFIG_FILE_NAME} config found in ${join(cwd(), CONFIG_FILE_NAME)}`
    );
  }
}
