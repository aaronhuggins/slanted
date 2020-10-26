export interface SlantedOpts {
  /** Path to the markdown file to be transformed. */
  filepath: string
  /** Path to directory of files to include. */
  includes?:string
  /** Temporary work directory; defaults to `.slate` within CWD. */
  tempdir?: string
  /** Flag to refresh the downloaded Slant repository; defaults to `false`. */
  refresh?: boolean
  /** Output file or directory; if a directory, the output file name will follow the input filename. Defaults to CWD. */
  output?: string
  /** Flag to inline html resources into a single file; defaults to `false`. */
  inline?: boolean
}
