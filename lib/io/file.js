'use strict'

const fs = require('fs')


/**
 * Write content to file and return a promise that resolves an object
 * with `{ path, content }`.
 *
 * @param {string} path - The path to the file
 * @param {string} content - The contents to write to the file
 * @returns {Promise.<string>} A Promise that resolves to the path of the file
 */
function writeFile (path, content) {
  return new Promise((resolve, reject) => {
    // TODO: check if file exists before writing
    fs.writeFile(path, content, err => {
      if (err) reject(err)

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
function readFile (path) {
  return new Promise((resolve, reject) => {
    // TODO: check if file exists before writing
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
function mkdir (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, err => {
      if (err) reject(err)

      resolve(path)
    })
  })
}


module.exports = {
  mkdir,
  readFile,
  writeFile,
}
