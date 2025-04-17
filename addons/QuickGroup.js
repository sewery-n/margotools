(function () {

    const config = {
        leaveKey: ']',
        addPlayers: '[',
    };

    const sendQueryToEngine = (parameter) => new Promise((resolve, reject) => _g(parameter));

    const isPlayerFriendly = (player) => (player.d?.relation == 5 || player.d?.relation == 4 || player.d?.relation == 2);

    document.addEventListener("keyup", async (event) => {
        if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
            if (event.key == config.leaveKey.toLowerCase()) {
                if (Engine?.party) {
                    if (Engine.hero.d.id === Engine.party.getLeaderId()) {
                        await sendQueryToEngine('party&a=disband');
                        message('Rozwiązałem grupę!');
                    } else await sendQueryToEngine('party&a=rm&id=' + Engine.hero.d.id);
                }
            } else if (event.key == config.addPlayers.toLowerCase()) {
                const players = Object.values(Engine.others.getDrawableList())
                    .filter(obj => isPlayerFriendly(obj));
                console.log(players);

                players.forEach(async player => await sendQueryToEngine('party&a=inv&id=' + player.d.id));
            }
        }
    });

})();