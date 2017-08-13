// @flow

import marked from 'marked'
import path from 'path'
import yaml from 'js-yaml'

import fs from '../io/file'
import Sandbox from '../sandbox'

type Dependencies = {
  fs: typeof fs,
  marked: typeof marked,
  path: typeof path,
  sandbox: Sandbox,
  yaml: typeof yaml,
}

const sectionHeadingRegex = new RegExp('^\\[([a-zA-Z]+)\\]$')

export default class TestFile {
  fs: typeof fs
  marked: typeof marked
  path: typeof path
  sandbox: Sandbox
  yaml: typeof yaml

  static new (dependencies?: Dependencies) {
    return new TestFile({
      fs,
      marked,
      path,
      sandbox: Sandbox.new(),
      yaml,
      ...dependencies,
    })
  }

  constructor ({ fs, marked, path, sandbox, yaml }: Dependencies) {
    this.fs = fs
    this.marked = marked
    this.path = path
    this.sandbox = sandbox
    this.yaml = yaml
  }

  getSectionHeading (block: Object) {
    const [, sectionName] = block.text.match(sectionHeadingRegex) || []

    return sectionName
  }

  async getFiles (workDirPath: string) {
    const testsDir = this.path.resolve(workDirPath, 'tests')
    const filePaths = await this.fs.readdir(testsDir)

    const testFiles = await Promise.all(
      filePaths
        .map(path => this.path.resolve(testsDir, path))
        .map(path => this.fs.readFile(path))
    )

    const steps = await Promise.all(
      testFiles.map(x => this.parse(x.toString()))
    )

    return steps
  }


  async parse (testFileContent: string): Promise<*> {
    const parsedMarkdown: Array<Object> = this.marked.lexer(testFileContent)

    // Queue up all the test step generations, then wait for them at the end
    const testSteps = parsedMarkdown.reduce((steps, block, index, arr) => {
      const previousBlock = index > 0 ? arr[index - 1] : null

      if (block.type === 'code' && previousBlock) {
        const section = this.getSectionHeading(previousBlock)

        if (typeof section === 'string') {
          const sectionDataPromise = this.resolveSectionData(block.lang, block.text)
            .then(data => ({ type: section.toLowerCase(), data }))

          steps.push(sectionDataPromise)
        }
      }

      return steps
    }, [])

    return Promise.all(testSteps)
  }

  async resolveSectionData (lang: string, text: string) {
    // TODO handlebars stuff, probably around here
    // TODO might not need to parse sections inside `body` if it's set to raw

    switch (lang) {
      case 'javascript': return this.sandbox.run(text)
      case 'json': return JSON.parse(text)
      case 'yaml': return this.yaml.safeLoad(text)

      // By default, lets just return the raw text
      default: return text
    }
  }
}
