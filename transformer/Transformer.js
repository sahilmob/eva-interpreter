class Transformer {
  transformDefToLambda(defExp) {
    const [_tag, name, params, body] = exp;
    return ["var", name, ["lambda", params, body]];
  }
}

module.exports = Transformer;
