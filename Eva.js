const Environment = require("./Environment");

/**
 * Eva interpreter
 */

class Eva {
  constructor(global = GlobalEnvironment) {
    this.global = global;
  }

  eval(exp, env = this.global) {
    if (this._isNumber(exp)) {
      return exp;
    }

    if (this._isString(exp)) {
      return exp.slice(1, -1);
    }

    // var declaration
    if (exp[0] === "var") {
      const [_tag, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    // var update
    if (exp[0] === "set") {
      const [_tag, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // var lookup
    if (this._isVariableName(exp)) {
      return env.lookup(exp);
    }

    // Block: sequence of expressions
    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    if (exp[0] === "if") {
      const [_tag, condition, consequent, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }
      return this.eval(alternate, env);
    }

    if (exp[0] === "while") {
      const [_tag, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    if (exp[0] === "def") {
      const [_tag, name, params, body] = exp;
      //   const fn = { params, body, env };

      //   return env.define(name, fn);

      const varExp = ["var", name, ["lambda", params, body]];
      return this.eval(varExp, env);
    }

    if (exp[0] === "lambda") {
      const [_tag, params, body] = exp;
      return { params, body, env };
    }

    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      if (typeof fn === "function") {
        return fn(...args);
      }

      const activationRecord = {};
      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnvironment = new Environment(activationRecord, fn.env);
      return this._evalBody(fn.body, activationEnvironment);
    }

    throw "Unimplemented " + JSON.stringify(exp);
  }

  _evalBody(body, env) {
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }

    return this.eval(body, env);
  }

  _evalBlock(blocks, env) {
    let result;
    const [_tag, ...expressions] = blocks;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }
  _isNumber(exp) {
    return typeof exp === "number";
  }
  _isString(exp) {
    return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
  }

  _isVariableName(exp) {
    return typeof exp === "string" && /^[+\-*/<>=a-zA-Z]*$/.test(exp);
  }
}

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: "0.1",

  "+"(op1, op2) {
    return op1 + op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "-"(op1, op2 = null) {
    if (op2 == null) {
      return -op1;
    }
    return op1 - op2;
  },
  "/"(op1, op2) {
    return op1 / op2;
  },
  ">"(op1, op2) {
    return op1 > op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
  ">="(op1, op2) {
    return op1 >= op2;
  },
  "<="(op1, op2) {
    return op1 <= op2;
  },
  "="(op1, op2) {
    return op1 === op2;
  },
  print(...args) {
    console.log(...args);
  },
});

module.exports = Eva;
