//this reduces a map into an object
function fromEntries (iterable) {
    return [...iterable].reduce((obj, [key, val]) => {
      obj[key] = val
      return obj
    }, {})
  }

module.exports = fromEntries