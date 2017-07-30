// @flow

import fs from 'fs'
import { FileExistsException } from '../exceptions'


export type FileSystem = {
  writeFile: (string, string | Buffer) => Promise<string>,
  readFile: (string) => Promise<Buffer>,
  mkdir: (string) => Promise<string>,
}


/**
 * Write content to file and return a promise that resolves an object
 * with `{ path, content }`.
 *
 * @param {string} path - The path to the file
 * @param {string | Buffer} content - The contents to write to the file
 * @returns {Promise.<string>} A Promise that resolves to the path of the file
 */
export function writeFile (path: string, content: string | Buffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) reject(err.code === 'EEXIST' ? FileExistsException(path) : err)

      resolve(path)
    })
  })
}


/**
 * Read content from a file and return a promise that resolves an object
 * with the file content.
 *
 * @param {string} path - The path to the file
 * @returns {Promise.<Buffer>} A Promise that resolves to the content of the file
 */
export function readFile (path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) reject(err)

      resolve(content)
    })
  })
}


/**
 * Creates a new directory at the specified path and returns a promise.
 * Resolves the promise with the value `{ path }`.
 *
 * @param {string} path - The path to the directory
 * @returns {Promise.<string>} A Promise that resolves to the path of the folder
 */
export function mkdir (path: string) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, 0o777, err => {
      if (err) reject(err.code === 'EEXIST' ? FileExistsException(path) : err)

      resolve(path)
    })
  })
}


export default ({
  mkdir,
  readFile,
  writeFile,
}: FileSystem)
