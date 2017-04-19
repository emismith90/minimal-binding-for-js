/*!
 * (c) 2017 Hung Le
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Auditor = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function isArray(obj) {
  return Array.isArray(obj);
}





function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

var hasProto = '__proto__' in {};

function ArrayProxyMutator(traverse) {
    var arrayProto = Array.prototype;
    var arrayPrototype = Object.create(arrayProto);

    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
        // cache original method
        var original = arrayProto[method];
        def(arrayPrototype, method, function mutator() {
            var arguments$1 = arguments;

            var i = arguments.length;
            var args = new Array(i);
            while (i--) {
                args[i] = arguments$1[i];
            }

            var oldVal = this.length;
            var newVal = original.apply(this, args);

            traverse(this, this.__auditor, this.__path);

            this.__auditor._propertyChanged({
                property: this.__path,
                oldValue: oldVal,
                newValue: newVal
            });

            return newVal;
        });
    });

    function interceptingMutatorMethods(target) {
        if (target.__arrayMutationIntercepted) return;

        target.__arrayMutationIntercepted = true;
        if (hasProto) {
            target.__proto__ = arrayPrototype;
        } else {
            var key = Object.getOwnPropertyNames(arrayPrototype);
            for (var i = 0, l = keys.length; i < l; i++) {
                var _key = keys[i];
                def(target, _key, arrayPrototype[_key]);
            }
        }
    }

    return {
        interceptingMutatorMethods: interceptingMutatorMethods
    };
}

function ObjectProxyMutator(traverse) {
    function interceptingMutatorMethods(model, key) {
        var property = Object.getOwnPropertyDescriptor(model, key);
        if (property && property.configurable === false) {
            return;
        }

        var value = model[key];
        if (isObject(value)) {
            if (value.__objectMutationIntercepted) return;
            value.__objectMutationIntercepted = true;
        }

        var setter = property && property.set;
        var getter = property && property.get;
        var prop = model.__path ? model.__path + '.' + key : key;

        Object.defineProperty(model, key, {
            enumerable: true,
            configurable: true,
            get: function proxyGetter() {
                return getter ? getter.call(model) : value;
            },
            set: function proxySetter(newVal) {
                var oldVal = getter ? getter.call(model) : value;
                if (newVal === oldVal) {
                    return;
                }

                if (setter) {
                    setter.call(model, newVal);
                } else {
                    value = newVal;
                }

                traverse(newVal, model.__auditor, model.__path);

                model.__auditor._propertyChanged({
                    property: prop,
                    oldValue: oldVal,
                    newValue: newVal
                });
            }
        });
    }

    return {
        interceptingMutatorMethods: interceptingMutatorMethods
    };
}

function ObjectBrowser() {
    var arrayMutator = new ArrayProxyMutator(traverse);
    var objectMutator = new ObjectProxyMutator(traverse);

    function traverse(model, auditor, path) {
        if (!isObject(model)) return;

        model.__auditor = auditor;
        model.__path = path;
        if (isArray(model)) {
            loopThroughArray(model);
        } else {
            loopThroughKeys(model);
        }
    }

    function loopThroughKeys(model) {
        var keys = Object.keys(model);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = model[keys[i]];

            // ignore internal properties
            if (key.startsWith('__')) continue;

            objectMutator.interceptingMutatorMethods(model, key);

            var propPath = model.__path ? model.__path + '.' + key : key;
            traverse(value, model.__auditor, propPath);
        }
    }

    function loopThroughArray(arrs) {
        arrayMutator.interceptingMutatorMethods(arrs);

        for (var i = 0, l = arrs.length; i < l; i++) {
            traverse(arrs[i], arrs.__auditor, arrs.__path + '[' + i + ']');
        }
    }

    return {
        traverse: traverse
    };
}

var Auditor$1 = function Auditor(model) {
    classCallCheck(this, Auditor);

    var auditor = void 0;
    if (!model.__auditor) {
        auditor = this;
        auditor._target = model;
        auditor._callbacks = [];
        auditor._propertyChanged = function (args) {
            auditor._callbacks.forEach(function (callback) {
                callback(args);
            });
        };

        auditor.onPropertyChanged = function (callback) {
            if (typeof callback === 'function') {
                auditor._callbacks.push(callback);
            }
        };

        var objectBrowser = new ObjectBrowser();
        objectBrowser.traverse(model, auditor);
    } else {
        auditor = model.__auditor;
    }
};

return Auditor$1;

})));
