/**
 * Flatten object to a single level
 * ex. { a: { b: 2 }, c: 3 } -> { 'a.b': 2, c: 3 }
 */
export const flatten = (
  obj: Object,
  roots = [],
  separator = '.',
): { [k in number | string]: number | string | boolean } =>
  // roots keeps previous parent properties as they will be added as a prefix for each prop.
  // separator is just a preference if you want to seperate nested paths other than dot.
  Object.keys(obj) // find props of given object
    .reduce(
      (memo, prop) =>
        Object.assign(
          {}, // create a new object
          memo, // include previously returned object
          Object.prototype.toString.call(obj[prop]) === '[object Object]'
            ? // keep working if value is an object
              flatten(obj[prop], roots.concat([prop]))
            : // include current prop and value and prefix prop with the roots
              { [roots.concat([prop]).join(separator)]: obj[prop] },
        ),
      {},
    ) // return an object by iterating props

/**
 *
 * @param markup HTML markup text to replace values
 * @param values Object with values to insert
 * @returns
 */
export const replaceTokens = (markup: string, values: Object) => {
  let re = /\$\(([^\)]+)?\)/g
  let match
  while ((match = re.exec(markup))) {
    markup = markup.replace(match[0], values[match[1]])
    re.lastIndex = 0
  }
  return markup
}
