
module.exports = {
  process() {
    return "module.exports = {};";
  },
  getCacheKey() {
    // The output is always the same. Therefore, a given input will always produce the same output.
    return "1";
  },
};


