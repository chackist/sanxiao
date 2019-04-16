var shared = shared || {};

// patch
(function () {
    var originalCleanup = cc.Node.prototype.cleanup;
    cc.Node.prototype.cleanup = function () {
        originalCleanup.call(this);
        this.__sharedEventUnavaiable = true;
    };
}());


/// Event class

/**
 * @class
 * @constructor
 */
shared.Event = function () {
    this._handlers = [];
};

/***
 * 添加事件侦听
 * 侦听会一直持结，如果obj为cc.Node，那么在节点移除时事件会自动失效
 * @param {function} callback
 * @param {cc.Node|Object|undefined} [objOrNode]
 */
shared.Event.prototype.attach = function (callback, objOrNode) {
    this._handlers.push({
        callback: callback,
        obj: objOrNode,
        once: false
    });
};

/**
 * 添加事件侦听，仅会触发一次，触发后自动失效
 * 如果obj为cc.Node，那么在节点移除时事件会自动失效
 * @param {Function} callback
 * @param {cc.Node|Object|undefined} [objOrNode]
 */
shared.Event.prototype.once = function (callback, objOrNode) {
    this._handlers.push({
        callback: callback,
        obj: objOrNode,
        once: true
    });
};

/**
 * 移除指定obj对应的所有事件侦听
 * @param obj
 */
shared.Event.prototype.detachForObject = function (obj) {
    for (var i = this._handlers.length - 1; i >= 0; --i) {
        var hd = this._handlers[i];
        if (hd.obj === obj) {
            this._handlers.splice(i, 1);
        }
    }
};

/**
 * 禁用全部事件
 */
shared.Event.prototype.detachAll = function () {
    this._handlers = [];
};

/**
 * 触发事件
 *
 */
shared.Event.prototype.trigger = function (/*arguments*/) {
    for (var i = this._handlers.length - 1; i >= 0; --i) {
        var hd = this._handlers[i];
        var exist = true;
        if (hd.obj !== undefined) {
            exist = !hd.obj.__sharedEventUnavaiable && (!hd.obj['__nativeObj'] || cc.sys.isObjectValid(hd.obj));
        }
        if (exist) {
            hd.callback.apply(hd.obj, arguments);
            if (hd.once) {
                this._handlers.splice(i, 1);
            }
        } else {
            this._handlers.splice(i, 1);
        }
    }
};

