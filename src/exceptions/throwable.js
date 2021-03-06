/**
 * Decorate the object returned by the exception function.
 *
 * @param exception
 * @param name
 * @returns {undefined}
 */
export default function ThrowableFactory (exception) {
  const name = exception.name

  function throwable (...args) {
    const toThrow = Object.assign(
      exception(...args),
      { name }
    )

    Object.defineProperty(toThrow, 'type', {
      value: throwable,
    })

    Object.defineProperty(toThrow, 'is', {
      value: type => toThrow.type === type,
    })

    Error.captureStackTrace(toThrow)

    return toThrow
  }

  Object.defineProperty(throwable, 'name', {
    value: name,
    writable: false,
  })

  return throwable
}
