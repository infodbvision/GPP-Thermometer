module.exports = function accepted(obj, props) {
    if(props.constructor === String) {
        return (!obj[props] || obj[props] === null || obj[props] === undefined);
    }

    const props_length = props.length;
    for (let i = 0; i < props_length; i++) {
        const prop = props[i];
        if (!obj[prop] || obj[prop] === null || obj[prop] === undefined) {
            return true;
        }
    }
    return false;
};
