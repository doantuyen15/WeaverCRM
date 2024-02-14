class useRequest extends Promise {
    constructor(callback, timeout = 5000) {
        const init = callback;
        super((resolve, reject) => {
            const timer = setTimeout(() => {
                reject('timeout');
            }, timeout);
            init(
                (value) => {
                    resolve(value);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    clearTimeout(timer);
                }
            );
        });
    }
    // static resolveWithTimeout(timeout, x) {
    //     if (!x || typeof x.then !== "function") {
    //         // `x` isn't a thenable, no need for the timeout,
    //         // fulfill immediately
    //         return this.resolve(x);
    //     }
    //     return new this(timeout, x.then.bind(x));
    // }
}

export default useRequest