define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager');

	function Planet(props) {
		var game = instanceManager.get('game');
		Phaser.Graphics.call(this, game, 0, 0);
		
		// draw a circle
		this.lineStyle(3, 0x33ff33, 1);
		this.beginFill(0xFFFF0B);
		this.drawCircle(props.x, props.y, 50);
		this.endFill();
	}
	
	Planet.prototype = Object.create(Phaser.Graphics.prototype);
	_.extend(Planet.prototype, {
		constructor: Planet,
	});
	
	window.Planet = Planet;
	return Planet;
});