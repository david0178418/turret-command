define(function(require) {
	"use strict";
	return {
			initGun: function(props) {
				this._coolDown = props._coolDown || 1000;
				this._lastFire = 0;
				this._gunOffsetX = props.offsetX || 0;
				this._gunOffsetY = props.offsetY || 0;
			},
			gunReady: function() {
				return this.game.time.now - this._lastFire > this._coolDown;
			},
			gunFired: function() {
				this._lastFire = this.game.time.now;
			}
		};
});