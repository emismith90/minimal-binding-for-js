/*!
 * Observable-Object v1.0.0
 *
 * MIT License. by Hung.Le.
 */

// This object will act as middle man when updating the target object.
function Observable(target) {
    target = target || {};

    var proxy = this;
    proxy._target = target;
    proxy._propertyChanged = function(args) {
        if(args.property === '_callbacks' 
        || args.property === 'onPropertyChanged') return; // no need to track its addition props
        
        target._callbacks.forEach(function(callback) {
            callback(args);
        });
    };

    target._callbacks = [];
    target.onPropertyChanged = function(callback) {
        if (typeof callback === 'function') {
            target._callbacks.push(callback);
        }
    };
    
    return new Proxy(target, proxy);
};

Observable.prototype.set = function(target, property, value) { 
    var oldValue = target[property];
    target[property] = value;
    
    if(oldValue === value) return false;

    this._propertyChanged({
        property: property,
        oldValue: oldValue,
        newValue: value,
        type: (oldValue===undefined ? 'add' : 'update')
    });

    return true;
};

Observable.prototype.deleteProperty = function(target, property) {
    var oldvalue = target[property];
    delete target[property];

    this._propertyChanged({
        property: property,
        oldValue: oldValue,
        newValue: null,
        type: 'delete'
    });
    
    return true;
};

Observable.prototype.defineProperty = function(target, property, descriptor) {
    Object.defineProperty(target, property, descriptor);

    this._propertyChanged({
        property: property,
        oldValue: null,
        newValue: descriptor,
        type: 'reconfigure'
    });

    return true;
};

Observable.prototype.setPrototypeOf = function(target, prototype) {
    var oldvalue = Object.getPrototypeOf(target);
    Object.setPrototypeOf(target, prototype);

    this._propertyChanged({
        property: '__proto__',
        oldValue: oldvalue,
        newValue: prototype,
        type: 'setPrototype'
    });

    return true;
};

Observable.prototype.preventExtensions = function(target) {
    Object.preventExtensions(target);

    this._propertyChanged({
        property: null,
        oldValue: null,
        newValue: null,
        type: 'preventExtensions'
    });

    return true;
};
