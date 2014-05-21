define(function(require) {
	"use strict";
	//TOD Fix HACK Either need to come up with an actual dependency injection solution or architect better
	var game = require('game'),
		ResourceFragmentController = require('entities/resource-fragment-controller');
	return new ResourceFragmentController(game);
});