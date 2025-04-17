(function () {

    const init = () => {
        try {
            if (!Engine || !Engine.communication) {
                setTimeout(init, 500);
                return;
            }

            if (typeof __build !== "object" && typeof __bootNI === "undefined") {
                setTimeout(init, 500);
                return;
            }

        } catch (error) {
            setTimeout(init, 500);
        }

        initCSS();
        drawLabels();
    };

    const initCSS = () => {
        const style = $(`<style>.stone-label {
            position: absolute;
            top: 20px;
            height: 16px;
            width: 32px;
            text-align: center;
            color: white;
            pointer-events: none;
            text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
            font-size: 0.45rem;
        }</style>`);
        $("body").append(style);
    }

    const intercept = (obj, key, cb, _ = obj[key]) => obj[key] = (...args) => {
        cb(...args)
        return _.apply(obj, args);
    };

    const drawLabels = () => {
        const stoneNames = GM_getValue('stonenames') || GM_setValue('stonenames', { 2354: '' });
        const teleports = Engine.items.fetchLocationItems("g").filter(item => {
            return item._cachedStats.custom_teleport;
        });
        if (teleports == '') {
            setTimeout(drawLabels, 2000);
            return;
        }
        teleports.forEach(teleport => {
            const id = teleport._cachedStats.custom_teleport.split(",")[0];
            const name = stoneNames[id];
            if (!name || !id) return;


            const label = $(`<div class="stone-label">${name}</div>`);
            $(`.item-id-${teleport.id}`).append(label);
        })
    }


    intercept(Engine.interface, 'showPopupMenu', (options, event) => {
        const id = event.target?.className?.match(/item-id-(\d+)/)?.[1];
        if (!id) return;
        const item = Engine.items.getItemById(id);
        if (!item) return;
        if (item._cachedStats.custom_teleport) {
            options.push(['Zmień nazwę', () => {
                const name = prompt("Wpisz nazwę dla kamienia: ");
                console.log(name);
                if (!name) return;

                const stoneNames = GM_getValue('stonenames');
                console.log(stoneNames);
                stoneNames[item._cachedStats.custom_teleport.split(",")[0]] = name;
                GM_setValue('stonenames', stoneNames);
            }, {
                    button: { cls: 'menu-item--purple' },
                }]);
        }
    });

    init();
})();