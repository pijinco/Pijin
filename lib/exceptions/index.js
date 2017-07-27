'use strict'

const throwable = require('./throwable')


/**
 * ConfigurationExpiredException
 *
 * @returns {undefined}
 */
function ConfigurationExpiredException () {
  return {
    message: 'The Configuration Object buffer has already been written to file.',
  }
}


/**
 * FileNotFoundException
 *
 * @param fileIdentifier
 * @returns {undefined}
 */
function FileNotFoundException (fileIdentifier) {
  return {
    message: `File ${fileIdentifier} does not exist.`,
  }
}


/**
 * FileExistsException
 *
 * @param fileIdentifier
 * @returns {undefined}
 */
function FileExistsException (fileIdentifier) {
  return {
    message: `File ${fileIdentifier} already exists.`,
  }
}


const exceptions = [
  FileNotFoundException,
  ConfigurationExpiredException,
  FileExistsException,
]


module.exports = exceptions
  .reduce((exports, exception) => {
    exports[exception.name] = throwable(exception)
    return exports
  }, {})
