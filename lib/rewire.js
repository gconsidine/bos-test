var rewire = require('rewire'),
    callsite = require('callsite'),
    path = require('path');

function expose(module) {
    var stack = callsite(),  
        caller = stack[1].getFileName();

    return rewire(path.resolve(path.dirname(caller), module));  
}

function get (module, property) {
    return module.__get__(property);
}

function set (module, property, value) {
    return module.__set__(property, value);
}

module.exports = {
  expose: expose,
  get: get,
  set: set,
  _: { 
    rewire: rewire
  }
};
