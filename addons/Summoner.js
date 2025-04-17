(a => {
    mAlert = function() {
        if (arguments[0] != undefined) {
            if (arguments[0].includes("przyzywa do siebie swoją drużynę")) {
                _g("party&a=acceptsummon&answer=1");
            }
        }
        return a.apply(this, arguments);
    }
})(mAlert);