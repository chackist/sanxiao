/**
 * userDefault为轻量级用户存储接口单例，使用方法同Cocos2dx C++的userDefault
 * 注意key值的使用不要和其它模块重复，使用 mode.xxx 命名方式来避免
 */
var userDefault = {};

userDefault.USER_LOGIN_TYPE_KEY = "USER_LOGIN_TYPE_KEY";

userDefault.LoginType = {
    GUEST: "guest",
    FACEBOOK : "facebook"
};

userDefault.setBoolForKey = function (key, value) {
    cc.sys.localStorage.setItem(key, value ? 'true' : 'false');
};

userDefault.getBoolForKey = function (key, defaultValue) {
    var value = cc.sys.localStorage.getItem(key);
    if (value == null) {
        return defaultValue ? true : false;
    }
    return value === 'true';
};

userDefault.setStringForKey = function (key, value) {
    cc.sys.localStorage.setItem(key, value + '');
};

userDefault.getStringForKey = function (key, defaultValue) {
    var value = cc.sys.localStorage.getItem(key);            // 注意，如果key不存在 android返回 空字符串,iOS和web返回null
    if (value == null) {
        return defaultValue === undefined ? '' : defaultValue;
    }
    return value + '';
};

userDefault.setIntegerForKey = function (key, value) {
    cc.sys.localStorage.setItem(key, value + '');
};

userDefault.getIntegerForKey = function (key, defaultValue) {
    defaultValue = defaultValue || 0;
    var strValue = cc.sys.localStorage.getItem(key);
    if (strValue == null || strValue == '') {
        return defaultValue;
    }
    var value = parseInt(strValue);
    if (isNaN(value)) {
        return defaultValue;
    } else {
        return value;
    }
};

userDefault.setFloatForKey = function (key, value) {
    var strValue = "" + value;
    cc.sys.localStorage.setItem(key, strValue);
};

userDefault.getFloatForKey = function (key, defaultValue) {
    defaultValue = defaultValue || 0;
    var strValue = cc.sys.localStorage.getItem(key);
    if (strValue == null || strValue == '') {
        return defaultValue;
    }
    var value = parseFloat(strValue);
    if (isNaN(value)) {
        return defaultValue;
    } else {
        return value;
    }
};

userDefault.removeItem = function (key) {
    if (cc.isUndefined(key)){
        key = "undefined";
        cc.log("WARNING: !!!!!!!! util.localStorageEncrypt.removeItem("+key+") !!!!!!!!");
    }
    cc.sys.localStorage.removeItem(key);
}
/**
 * 清空所有配置
 */
userDefault.clear = function () {
    cc.sys.localStorage.clear();
};
