define(function(require) {
	"use strict";
	var States = require('states'),
		injector = require('injector'),
		game = injector.get('game');
	
	require('states/play');

	return function() {
		game.state.start(States.Play);
	};
});