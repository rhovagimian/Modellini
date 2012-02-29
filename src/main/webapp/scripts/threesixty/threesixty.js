threeSixty = {
    init: function() {
        this._vr = new AC.VR('viewer', 'images/rotating/3dcar##.jpg', 80, {
            invert: true
        });
    },
    didShow: function() {
        this.init();
    },
    willHide: function() {
        recycleObjectValueForKey(this, "_vr");
    },
    shouldCache: function() {
        return false;
    }
}
if (!window.isLoaded) {
    window.addEventListener("load", function() {
        threeSixty.init();
    }, false);
}
