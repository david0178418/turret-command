define(function(require) {
	"use strict";
	var States = require('states'),
		instanceManager = require('instance-manager'),
		game = instanceManager.get('game');
	
	require('states/play');

	return function() {
		game.state.start(States.Play);
	};
});