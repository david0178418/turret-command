define(function(require) {
	"use strict";
	return {
			isDead: function() {
				return this.health <= 0;
			},
			damage: function(points) {
				this.health -= points;
				if(this.health < 0) {
					this.health = 0;
				}
				return this.health;
			}
		};
});