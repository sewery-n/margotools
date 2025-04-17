(function () {

    let switchToId;

    const intercept = (obj, key, cb, _ = obj[key]) => obj[key] = (...args) => {
        cb(...args)
        return _.apply(obj, args);
    };

    intercept(Engine.interface, 'showPopupMenu', (options, event) => {
        const isBuildsPopup = event.target?.className?.match('builds-interface');
        if (isBuildsPopup) {
            options.forEach((option, index) => {
                const [label, fn] = option;

                if (typeof fn === 'function') {
                    options[index][1] = (...args) => {
                        switchToId = label.split('.')[0].trim();
                        return fn.apply(this, args)
                    }
                }
            })
        }
    });


    intercept(Engine.communication, 'parseJSON', (data) => {
        if (data.f) {
            if (data.f.close) {
                if (switchToId) {
                    setTimeout(() => {
                        _g('builds&action=updateCurrent&id=' + switchToId);
                        switchToId = null;
                    }, 0);
                }
            }
        }
    });
})();