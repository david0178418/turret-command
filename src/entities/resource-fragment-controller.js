define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		ResourceFragment = require('entities/resource-fragment');
	
	function ResourceFragmentController(game) {
		this.game = game;
		this.resourceFragments = game.add.group();
		this.baseInterval = 500;
		this.intervalRange = 2000;
		this.nextSpawn = 2000;
		this.level = 0;
		this.killCount = 0;
		this.speedInterval = 50;
		window.resourceFragments = this.resourceFragments; //debug
	}
	
	ResourceFragmentController.DIRECTION_ARC = 45;
	ResourceFragmentController.SPAWN_SPEED = 150;
	
	ResourceFragmentController.prototype = {
		spawnResourceFragments: function(x, y, value) {
			var resource,
				resourceCount = 1 + _.random(value),
				properties = {
					x: x,
					y: y,
					speed: ResourceFragmentController.SPAWN_SPEED,
					value: 10
				};
			
			for(var x = 0; x <= resourceCount; x++) {
				properties.angle = _.random(-ResourceFragmentController.DIRECTION_ARC - 90, ResourceFragmentController.DIRECTION_ARC - 90);
				resource = this.resourceFragments.getFirstDead();
					
				if(!resource) {
					resource = new ResourceFragment(properties, this.game);

					this.resourceFragments.add(resource);
				} else {
					resource.spawn(properties);
				}
			}
		},
	};
	
	ResourceFragmentController.preload = function(game) {
		ResourceFragment.preload(game);
	};

	return ResourceFragmentController;
});