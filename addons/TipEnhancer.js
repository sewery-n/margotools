(function() {

    const intercept = (obj, key, cb, _ = obj[key]) => obj[key] = (...args) => {
        cb(...args)
        return _.apply(obj, args);
    };

    const getLootInfo = (name) => {
        const targetItem = Engine.items.fetchLocationItems('g').find(el => el.name == name)._cachedStats?.loot;
        if(!targetItem) return;

        const info = targetItem?.split(',');

        return {
            nick: info[0],
            party: info[2],
            timeStamp: getTimeFromTimestamp(info[3]),
            monster: info[4]
        }
    }

    const getTimeFromTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);

        const options = {
            timeZone: 'Europe/Warsaw',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        return new Intl.DateTimeFormat('pl-PL', options).format(date);
    }

    let lastTipId;
    intercept(TIPS, '_move', (t) => {

        setTimeout(() => {
            const tooltip = TIPS.$tip[0];
            if (!tooltip || !tooltip.dataset) return;

            const oldInfo = tooltip.querySelector('.extra-info');
            if (oldInfo) oldInfo.remove();
            tooltip.style.background = `rgba(0, 0, 0, 0)`;

            const parser = new DOMParser();
            const doc = parser.parseFromString(tooltip.innerHTML, 'text/html');

            const lvlReq = doc.querySelector('.level-required');
            let level = 0;
            if (lvlReq) {
                const match = lvlReq.textContent.match(/Wymagany poziom:\s*(\d+)/);
                if (match) level = parseInt(match[1], 10);
            }

            const base = (180 + level) * 1000;
            const costs = [base, base * 1.1, base * 1.3, base * 1.6, base * 2.0];
            const totalUpgradePoints = costs.reduce((a, b) => a + b, 0);

            const name = doc.querySelector('.item-name')?.textContent.trim();
            const lootInfo = name ? getLootInfo(name) : null;

            const upgradeInfoHTML = `
    <div class="extra-info">
        <div style="padding: 10px; font-size: 12px; text-align: center; margin-top: 5px; margin-bottom: 15px;">
            <span class="damage">DODATKOWE INFORMACJE</span><br>
            Ilość esencji: <span class="damage">${Math.round(((level / 10 + 10) * (1 + 0.2 * 5)) / 2)}</span><br>
            ${lootInfo?.timeStamp ? `Godzina zdobycia: <span class='damage'>${lootInfo.timeStamp}</span><br>` : ""}
            ${(lootInfo?.party && lootInfo?.party > 1) ? `Wielkość drużyny: <span class='damage'>${lootInfo.party}</span><br>` : ""}
            <br>
            <span class="damage">CAŁKOWITY KOSZT ULEPSZENIA:</span><br>
            Punkty: <span class="damage">${Math.round(totalUpgradePoints).toLocaleString('pl-PL')}</span> | Esencja: <span class="damage">${Math.round((level / 10 + 10) * 3)}</span>
        </div>
    </div>`;

            const isLegItem = t?.currentTarget?.dataset?.tipType === 't_item' &&
                  t?.currentTarget?.dataset?.itemType === 't-leg';

            if (isLegItem) {
                tooltip.insertAdjacentHTML('beforeend', upgradeInfoHTML);
            }
            tooltip.style.background = `rgba(15, 15, 15, 0.75)`;
        }, 0);
    });
})();