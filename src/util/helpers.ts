
// Retrieve token from request header
export function extractJwtToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(" ")[ 0 ] === "Bearer" ||
    req.headers.authorization && req.headers.authorization.split(" ")[ 0 ] === "Token"
    ) {
        return req.headers.authorization.split(" ")[ 1 ];
    } if (req.query && hasProp(req.query, "token")) {
        return req.query.token;
    }
    return null;
}

export function setLimit(inputlimit) {
    const limit = parseInt(inputlimit, 10);
    // eslint-disable-next-line no-restricted-globals
    return (isNaN(limit) || limit == null || limit > 100 || limit == 0) ? 100 : limit;
}

export function timestamp() {
    return `${new Date().toISOString().slice(0, 22)}Z`;
    //   return new Date().toISOString().slice(0, 19).replace("T", " ")+"Z";
}

export function dateDaysAgo(since = 0) {
    const today = new Date();
    today.setDate(today.getDate() - since);
    return today.toISOString();
}

export function randomNum() {
    return Math.floor(Math.random() * 1000000);
}

export function cloneObject(model = {}, source) {
    return Object.assign(model, source);
}

/**
 * @description getObjectByKey returns the object from an Array of
 * Objects that has the key with a given value or undefined!
 * @param {Array} arrayObject Array of Objects
 * @param {String} key Object key could be a String or Integer
 * @param {String} value Object value could be a String or Integer
 */
export function getObjectByKey(arrayObject, key, value) {
    return arrayObject.find(obj => obj[ key ] === value);
}


/**
 * @description addToArrayOfObjects add a new object item to an array of objects
 * @param {Object} arrayOfObjects the array of object
 * @param {Number} limit maximum number of objects the array should not exceed
 * @param {Object} newObjectElement the new item to be added to the array of objects
 * @returns {Object} the new array of Objects
 */
export default function addToArrayOfObjects(arrayOfObjects, limit, newObjectElement) {
    const size = Object.keys(arrayOfObjects).length;
    if (size < limit) {
        arrayOfObjects.push(newObjectElement);
    } else {
    // arr.splice(indexToRemove, numToRemove)
        arrayOfObjects.splice(0, 1);
        arrayOfObjects.push(newObjectElement);
    }
    return arrayOfObjects;
}

/**
 * @description getClientAccess get the Ip Address and TimeSTamp of a request object.
 * @param {String} req the request object
 * @returns {Object} { accessDate, ipAddress } access date and the ip address
 */
export function getClientAccess(req) {
    const ipAddress = req.ip || req._remoteAddress;
    // const lang = req.get("accept-language");
    const accessDate = req._startTime || "";
    return { accessDate, ipAddress };
}

export function isRealValue(obj) {
    return obj && obj !== "null" && obj !== "undefined";
}

export function hasProp(obj, prop) {
    if (!isRealValue(obj)) return false;
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function isObjecId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) return true;
    return false;
}

/**
 * @returns a six-digit random number
 */
export function generateOtp() {
    const num = Math.floor(Math.random() * 900000) + 100000;
    return num;
}


export function cleanDeepObject(obj) {
    // eslint-disable-next-line no-restricted-syntax
    for (const propName in obj) {
        if (!obj[ propName ] || obj[ propName ].length === 0) {
            delete obj[ propName ];
        } else if (typeof obj === "object") {
            cleanDeepObject(obj[ propName ]);
        }
    }
    return obj;
}

let depth = 0;

// eslint-disable-next-line complexity
export function cleanObject(obj) {
    depth += 1;
    // eslint-disable-next-line no-restricted-syntax
    for (const propName in obj) {
        if (!obj[ propName ] || obj[ propName ].length === 0) {
            delete obj[ propName ];
        } else if (typeof obj === "object") {
            if (depth <= 3) cleanObject(obj[ propName ]);
        }
    }
    return obj;
}

/**
 * @description a function that removes duplicates from an array of objects
 * @param {Array} arrayOfObj an array of objects with duplicate value for
 *  a given property
 * @param {String} prop the property with duplicate values that renneds to be filtered by
 */
export function removeDuplicates(arrayOfObj, prop) {
    const setOfSeenObj = new Set();
    const filteredArr = arrayOfObj.filter((item) => {
        const duplicate = setOfSeenObj.has(item[ prop ]);
        setOfSeenObj.add(item[ prop ]);
        return !duplicate;
    });
    return filteredArr;
}

export function nextDate(d = 1) {
    return new Date(new Date().setDate(new Date().getDate() + d));
}

function genString(length, possible = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789") {
    let text = "";
    const str = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
        text += str.charAt(Math.floor(Math.random() * str.length));
    }
    return text;
}

function daysIntoYear(date = new Date()) {
    // eslint-disable-next-line max-len
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

export function genCode(len = 9) {
    let d = new Date().getFullYear().toString().substr(-2);
    d += daysIntoYear();
    if (len - d.length > 0) return d + genString(len - d.length);
    return genString(len);
}

export function hasNull(Obj = {}) {
    const val = Object.values(Obj);
    if (val.includes(null) || val.includes(undefined) || val.includes("")) return true;
    return false;
}

/**
 * @function stringToArrayPhone()
 * @param str Comma-Separated string of Phone numbers
 * @returns Array of Phone numbers with whote spaces
 */

// export function stringToArrayPhone(str) {
//     const arr = str.split(",").map(st => st.trim()) || []; // remove spaces
//     const filtered = arr.filter((value, index) => (value.length >= 11 && value.length < 15));
//     return [...new Set(filtered)]; // Remove duplicates
// }

export function getIpAddressFromRequest(request) {
    let ipAddr = request.connection.remoteAddress;
    if (request.headers && request.headers[ "x-forwarded-for" ]) {
        [ipAddr] = request.headers[ "x-forwarded-for" ].split(",");
    }
    return ipAddr;
}
