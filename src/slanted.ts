import { RequestIt } from 'request-it-client'
import { extract, FileStat } from 'tar'
import { isMatch } from 'micromatch'
import { html } from 'web-resource-inliner'
import { promisify } from 'util'
import { copy, mkdirs, pathExists, readFile, remove, writeFile } from 'fs-extra'
import { basename, dirname, join } from 'path'
import {
  DEFAULT_OPTS,
  SLANT_FILE,
  SLANT_DIR,
  SLANT_URL,
  UNPACK_IGNORE,
  SLANT_INDEX
} from './constants'
import { run } from './helpers'
import type { SlantedOpts } from './interfaces'

/** Convert a Slant-compliant markdown to static html documentation. */
export async function slanted (options: SlantedOpts = DEFAULT_OPTS) {
  const internalOpts: SlantedOpts = {
    ...DEFAULT_OPTS,
    ...options
  }
  const slantPath = join(internalOpts.tempdir, SLANT_DIR)
  const tarPath = join(internalOpts.tempdir, SLANT_FILE)
  const filename = basename(internalOpts.filepath)
  const fileContents = await readFile(internalOpts.filepath)

  if (!(await pathExists(internalOpts.tempdir))) {
    await mkdirs(internalOpts.tempdir)
  }

  if (internalOpts.refresh || !(await pathExists(tarPath))) {
    const response = await RequestIt.get(SLANT_URL)

    if (response.statusCode === 200) {
      await writeFile(tarPath, response.rawBody)
    } else {
      throw new Error(`${response.statusCode} ${response.body}`)
    }
  }

  if (await pathExists(slantPath)) {
    await remove(slantPath)
  }

  await extract({
    file: tarPath,
    cwd: internalOpts.tempdir,
    filter: (path: string, stat: FileStat) => !isMatch(path, UNPACK_IGNORE, { dot: true })
  })

  if (typeof internalOpts.includes === 'string') {
    await copy(internalOpts.includes, join(slantPath, 'source/_includes'))
  }

  await writeFile(join(slantPath, SLANT_INDEX), fileContents)
  await copy(require.resolve('imagesloaded/imagesloaded.pkgd.min.js'), join(slantPath, 'source/slate/js/lib/imagesloaded.min.js'))
  await copy(require.resolve('jquery/dist/jquery.min.js'), join(slantPath, 'source/slate/js/lib/jquery.min.js'))
  await copy(require.resolve('lunr/lunr.min.js'), join(slantPath, 'source/slate/js/lib/lunr.min.js'))
  await run('npx', ['sass', '--update', '--style', 'compressed', '--no-source-map', './source/slate/css'], { cwd: slantPath })
  await run('npx', ['@11ty/eleventy', '--input=./source/*.md'], { cwd: slantPath })

  let outputPath = internalOpts.output
  let outputFile = filename.replace(/.md$/gu, '.html')

  if (internalOpts.output.endsWith('.html')) {
    outputPath = dirname(internalOpts.output) || './'
    outputFile = basename(internalOpts.output)
  }

  if (internalOpts.inline) {
    const htmlAsync = promisify(html)
    const htmlContents = await readFile(join(slantPath, '_site/index.html'), 'utf8')
    const inlineHtml = await htmlAsync({
      fileContent: htmlContents,
      relativeTo: join(slantPath, '_site'),
      images: 32,
      svgs: 32
    })

    await mkdirs(outputPath)
    await writeFile(join(outputPath, outputFile), inlineHtml)
  } else {
    await copy(join(slantPath, '_site/slate'), join(outputPath, 'slate'))
    await copy(join(slantPath, '_site/index.html'), join(outputPath, outputFile))
  }
}
