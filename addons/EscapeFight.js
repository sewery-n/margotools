
(function () {

    let mode = false;
    const intercept = (obj, key, cb, _ = obj[key]) => obj[key] = (...args) => {
        cb(...args)
        return _.apply(obj, args);
    };


    intercept(Engine.interface, 'showPopupMenu', (options, event) => {
        const id = event.target?.className?.match(/item-id-(\d+)/)?.[1];
        const item = Engine.items.getItemById(id);
        if (item?._cachedStats.custom_teleport || item?._cachedStats.teleport) {
            if (!mode) {
                options.push(['Użyj po walce', () => {
                    GM_setValue('teleport', id);
                    mode = true;
                }, {
                    button: { cls: 'menu-item--blue' },
                }]);
            } else {
                options.push(['Zatrzymaj', () => {
                    GM_setValue('teleport', '');
                    mode = false;
                }, {
                    button: { cls: 'menu-item--red' },
                }]);
            }

        }
    });

    intercept(Engine.communication, 'parseJSON', (data) => {
        if (data.f) {
            if (data.f.close) {
                if (mode) {
                    let teleport = GM_getValue('teleport');
                    setTimeout(() => {
                        _g("moveitem&st=1&id=" + teleport);
                        mode = false;
                        GM_setValue('teleport', '');
                    }, 0);
                }
            }
        }
    });

    intercept(Engine.communication, 'parseJSON', (data) => {
        if (data.clan) {
            console.log(data.clan);
        }
    });


})();