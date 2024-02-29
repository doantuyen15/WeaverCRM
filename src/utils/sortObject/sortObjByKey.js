const sortObjByKey = (obj) => {
    return Object.keys(obj)
        .sort()
        .reduce((accumulator, key) => {
            accumulator[key] = obj[key];

            return accumulator;
        }, {});
}

export default sortObjByKey