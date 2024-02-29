const sortObjByValue = (obj, field) => {
    return Object.keys(obj)
        .sort((a, b) => (
            obj[a][field] - obj[b][field]
        ))
        .reduce((accumulator, key) => {
            accumulator[key] = obj[key];

            return accumulator;
        }, {});
}

export default sortObjByValue