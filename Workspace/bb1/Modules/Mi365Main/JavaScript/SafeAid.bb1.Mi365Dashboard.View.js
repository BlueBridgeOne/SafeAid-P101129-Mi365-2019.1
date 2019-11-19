// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Dashboard.View'
,	[
		'safeaid_bb1_mi365dashboard.tpl'
	,	'Utils'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	,'Mi365Overview'
	]
,	function (
		safeaid_bb1_mi365dashboard_tpl
	,	Utils
	,	Backbone
	,	jQuery
	,	_
	,Mi365Overview
	)
{
	'use strict';

	// @class SafeAid.bb1.Mi365Main.View @extends Backbone.View
	return Backbone.View.extend({

		template: safeaid_bb1_mi365dashboard_tpl

	,	initialize: function (options) {
		this.overview=Mi365Overview.get();
		var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});
			
		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {
			
		}

	,	getContext: function getContext()
		{
			return {
				
			};
		}
	});
});