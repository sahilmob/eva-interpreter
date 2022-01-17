class Environment {
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  define(name, value) {
    this.record[name] = value;
    return value;
  }

  assign(key, value) {
    this.resolve(key).record[key] = value;
    return value;
  }

  lookup(key) {
    return this.resolve(key).record[key];
  }

  resolve(key) {
    if (this.record.hasOwnProperty(key)) {
      return this;
    }

    if (this.parent === null) {
      throw new ReferenceError(`Variable "${key}" is not defined.`);
    }

    return this.parent.resolve(key);
  }
}

module.exports = Environment;
