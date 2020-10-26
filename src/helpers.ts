import { spawn } from 'cross-spawn'
import type { SpawnOptionsWithoutStdio } from 'child_process'

/** @hidden */
export async function run (
  command: string,
  args?: string[] | Buffer,
  input?: Buffer | SpawnOptionsWithoutStdio,
  options?: SpawnOptionsWithoutStdio
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof input === 'object' && !Buffer.isBuffer(input)) {
      options = input
      input = undefined
    }
    if (Buffer.isBuffer(args) && input === undefined) {
      input = args
      args = undefined
    }

    const output: Buffer[] = []
    const error: Buffer[] = []
    const child = spawn(command, Array.isArray(args) ? args : undefined, options)

    if (input !== undefined) child.stdin.end(input)
    child.stdout.on('data', (data: Buffer) => output.push(data))
    child.stderr.on('data', (data: Buffer) => error.push(data))
    child.on('close', (code: number) => {
      if (error.length > 0 && code !== 0) {
        const [message, ...stack] = error
        const rejected = new Error(message.toString('utf8').trim())
        rejected.stack = stack.join('')
        reject(rejected)
      } else {
        resolve(output.join(''))
      }
    })
    child.on('error', (err: Error) => reject(err))
  })
}
