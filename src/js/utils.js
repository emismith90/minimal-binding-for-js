function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number';
};
function isObject (obj) {
  return obj !== null && typeof obj === 'object';
}

function isArray(obj){
  return Array.isArray(target);
}

function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  });
};

function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  };
}

function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

var hasProto = '__proto__' in {};