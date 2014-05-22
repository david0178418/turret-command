define(function(require) {
	"use strict";
	//TOD Fix HACK Either need to come up with an actual dependency injection solution or architect better
	var game = require('singletons/game'),
		ResourceFragments = require('controllers/resource-fragments');
	return new ResourceFragments(game);
});