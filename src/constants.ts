import { SlantedOpts } from "./interfaces"

export const SLANT_BRANCH = 'main'
export const SLANT_FILE = SLANT_BRANCH + '.tar.gz'
export const SLANT_URL = 'https://github.com/ahuggins-nhs/slant/archive/' + SLANT_FILE
export const SLANT_DIR = 'slant-' + SLANT_BRANCH
export const SLANT_INDEX = 'source/index.md'
export const DEFUALT_TEMPDIR = '.slanted'

export const UNPACK_IGNORE: string[] = [
  '.github/**',
  'docs/**',
  'source/_includes/errors.md',
  SLANT_INDEX,
  '.*ignore',
  '.editorconfig',
  '.eslint*',
  '.git*',
  'CODE_*',
  'Docker*',
  'package-lock.json',
  'README.md'
].map(item => SLANT_DIR + '/' + item)

export const DEFAULT_OPTS: SlantedOpts = {
  filepath: 'index.md',
  tempdir: DEFUALT_TEMPDIR,
  refresh: false,
  output: './'
}
