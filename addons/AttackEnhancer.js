(function () {

    let idToAttack;

    const intercept = (obj, key, cb, _ = obj[key]) => obj[key] = (...args) => {
        cb(...args)
        return _.apply(obj, args);
    };

    intercept(Engine.interface, 'showPopupMenu', (options, event) => {
        const isPlayerPopup = event.target?.className.match('do-action-cursor');
        if (isPlayerPopup) {
            if(options.find(option => option[0] == 'Złość się') || options.find(option => option[0] == 'Przejdź')) return;

            idToAttack ? options.push(['Przestań dobijać', () => {
                const originalFN = options.find(option => option[0] == 'Przerwij atak')?.[1];
                if (originalFN) {
                    const result = originalFN.apply(this, arguments);
                    idToAttack = null;
                    return result;
                }
            }, {
                    button: { cls: 'menu-item--red' },
                }]) : options.push(['Dobijaj', () => {
                    const originalFN = options.find(option => option[0] == 'Atakuj')?.[1];
                    if (originalFN) {
                        const result = originalFN.apply(this, arguments);
                        const target = Engine.hero.markOtherObj;
                        idToAttack = target.d.id;
                        return result;
                    }
                }, {
                        button: { cls: 'menu-item--purple' },
                    }]);
        }
    });

    intercept(Engine.communication, 'parseJSON', (data) => {
        if (data.emo) {
            if (idToAttack) {
                let target = Object.values(data.emo).find(obj => obj.source_id == idToAttack);
                if (target.name == 'noemo') {
                    _g('fight&a=attack&id=' + idToAttack);
                }
            }

        }
    });


})();