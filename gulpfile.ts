import * as gulp from 'gulp'
import * as shell from 'gulp-shell'
import { mkdirs, readFile, writeFile } from 'fs-extra'
import { join } from 'path'
import { RequestIt } from 'request-it-client'
import { extract } from 'tar'
import { SLANT_URL, DEFUALT_TEMPDIR, SLANT_FILE, SLANT_DIR } from './src/constants'

function shellTask (commands: string | string[], options?: { name?: string; [prop: string]: any }): () => Promise<void> {
  const task = shell.task(commands, options as any)

  if (options && typeof options.name === 'string') {
    Object.defineProperty(task, 'name', { value: options.name })
  }

  return task
}

export async function trackDeps () {
  const response = await RequestIt.get(SLANT_URL)

  if (response.statusCode === 200) {
    const tarPath = join(DEFUALT_TEMPDIR, SLANT_FILE)
    const slantPkgPath = SLANT_DIR + '/package.json'
    const pkg: Record<string, any> = JSON.parse(await readFile('./package.json', 'utf8'))

    await mkdirs(DEFUALT_TEMPDIR)
    await writeFile(tarPath, response.rawBody)
    await extract({
      file: tarPath,
      cwd: DEFUALT_TEMPDIR
    }, [slantPkgPath])

    const slantPkg = JSON.parse(await readFile(join(DEFUALT_TEMPDIR, slantPkgPath), 'utf8'))
    const deps: Record<string, any> = slantPkg.dependencies
    const sorted = new Map<string, any>([...Object.entries(pkg.dependencies), ...Object.entries(deps)].sort())

    pkg.dependencies = {}

    for (const [key, value] of sorted.entries()) {
      pkg.dependencies[key] = value
    }

    await writeFile('./package.json', JSON.stringify(pkg, null, 2) + '\n')
  }
}

export const compile = shellTask(['tsc'], { name: 'compile' })
export const prepack = gulp.series(trackDeps, compile)

export const typedoc = shellTask(['typedoc'], { name: 'typedoc' })
