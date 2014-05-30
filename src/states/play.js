define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		Phaser = require('phaser'),
		States = require('states'),
		Meteors = require('controllers/meteors'),
		Building = require('entities/building'),
		Planet = require('entities/planet'),
		Beam = require('entities/beam'),
		Ship = require('entities/ship'),
		Hud = require('interface/hud'),
		DragSelection = require('interface/drag-selection'),
		instanceManager = require('instance-manager'),
		resourceFragments,
		game = instanceManager.get('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		preload: function(game) {
			Building.preload(game);
			Meteors.preload(game);
			Hud.preload(game);
			Beam.preload(game);
		},
		create: function(game) {
			resourceFragments = instanceManager.get('resourceFragments');
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setShowAll();
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVeritcally = true;
			game.scale.refresh();

			window.addEventListener('resize', function() {
				game.scale.setShowAll();
				game.scale.refresh();
			});

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			game.stage.backgroundColor = '#333';
		},
		update: function(game) {
			
		},
		paused: function() {
		},
	});
});