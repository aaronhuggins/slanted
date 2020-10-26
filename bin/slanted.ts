#!/usr/bin/env node
import * as parse from 'yargs-parser'
import { slanted } from '../src/slanted'
import { DEFAULT_OPTS } from '../src/constants'
import type { SlantedOpts } from '../src/interfaces'

type SlantedArgs = parse.Arguments & SlantedOpts

async function main () {
  const options: SlantedArgs = parse(Array.prototype.slice.call(process.argv, 2), {
    boolean: ['inline', 'refresh', 'help'],
    string: ['includes', 'tempdir', 'output', 'filepath'],
    default: DEFAULT_OPTS
  }) as SlantedArgs
  const helpfile = `
  slanted [filepath=index.md] [...options]

  filepath: Path to the markdown file to be transformed; defaults to 'index.md'.

  Options:
  --includes      [String] Path to directory of files to include.
  --tempdir       [String] Temporary work directory; defaults to '.slate' within CWD.
  --output        [String] Output file or directory; if a directory, the output file name will
                  follow the input filename. Defaults to CWD.
  --inline        [Boolean] Flag to inline html resources into a single file; defaults to 'false'.
  --refresh       [Boolean] Flag to refresh the downloaded Slant repository; defaults to 'false'.
  `
  const [filepath] = options._

  if (options.help) {
    console.log(helpfile)

    return
  }

  if (typeof filepath === 'string' && filepath.toLowerCase().endsWith('.md')) {
    options.filepath = filepath
  }

  await slanted(options)
}

main()
