(function (exports) {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var ArrayProxyMutator = function () {
    function ArrayProxyMutator(traverse) {
        classCallCheck(this, ArrayProxyMutator);

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
    }

    createClass(ArrayProxyMutator, [{
        key: 'interceptingMutatorMethods',
        value: function interceptingMutatorMethods(target) {
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
    }]);
    return ArrayProxyMutator;
}();

var ObjectProxyMutator = function () {
    function ObjectProxyMutator(traverse) {
        classCallCheck(this, ObjectProxyMutator);
    }

    createClass(ObjectProxyMutator, [{
        key: 'interceptingMutatorMethods',
        value: function interceptingMutatorMethods(model, key) {
            var property = Object.getOwnPropertyDescriptor(model, key);
            if (property && property.configurable === false) {
                return;
            }

            var value = model[key];

            if (value.__objectMutationIntercepted) return;
            value.__objectMutationIntercepted = true;

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
    }]);
    return ObjectProxyMutator;
}();

var ObjectBrowser = function () {
    function ObjectBrowser() {
        classCallCheck(this, ObjectBrowser);

        this.arrayMutator = new ArrayProxyMutator(traverse);
        this.objectMutator = new ObjectProxyMutator(traverse);
    }

    createClass(ObjectBrowser, [{
        key: 'traverse',
        value: function traverse(model, auditor, path) {
            if (!isObject(model)) return;

            model.__auditor = auditor;
            model.__path = path;
            if (Array.isArray(model)) {
                loopThroughArray(model);
            } else {
                loopThroughKeys(model);
            }
        }
    }, {
        key: 'loopThroughKeys',
        value: function loopThroughKeys(model) {
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
    }, {
        key: 'loopThroughArrayfunction',
        value: function loopThroughArrayfunction(arrs) {
            arrayMutator.interceptingMutatorMethods(arrs);

            for (var i = 0, l = arrs.length; i < l; i++) {
                traverse(arrs[i], arrs.__auditor, arrs.__path + '[' + i + ']');
            }
        }
    }]);
    return ObjectBrowser;
}();

exports.ObjectBrowser = ObjectBrowser;

}((this['minimal-binding'] = this['minimal-binding'] || {})));
