import throwable from './throwable'


/**
 * ConfigurationExpiredException
 *
 * @returns {undefined}
 */
export const ConfigurationExpiredException = throwable(
  function ConfigurationExpiredException () {
    return {
      message: 'The Configuration Object buffer has already been written to file.',
    }
  }
)


/**
 * FileNotFoundException
 *
 * @param fileIdentifier
 * @returns {Object}
 */
export const FileNotFoundException = throwable(
  function FileNotFoundException (fileIdentifier) {
    return {
      message: `File ${fileIdentifier} does not exist.`,
    }
  }
)

/**
 * FileExistsException
 *
 * @param fileIdentifier
 * @returns {undefined}
 */
export const FileExistsException = throwable(
  function FileExistsException (fileIdentifier) {
    return {
      message: `Path ${fileIdentifier} already exists.`,
    }
  }
)


/**
 * InvalidArgumentException
 *
 * @param fileIdentifier
 * @returns {undefined}
 */
export const InvalidArgumentException = throwable(
  function InvalidArgumentException (arg) {
    return {
      message: `Argument ${arg} is invalid.`,
    }
  }
)


/**
 * InvalidMarkdownException
 *
 * @param fileIdentifier
 * @returns {undefined}
 */
export const InvalidMarkdownException = throwable(
  function InvalidMarkdownException (reason) {
    return {
      message: `Invalid Markdown Format: ${reason}`,
    }
  }
)

