// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Dashboard.View'
,	[
		'safeaid_bb1_mi365dashboard.tpl'
	,	'Utils'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		safeaid_bb1_mi365dashboard_tpl
	,	Utils
	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class SafeAid.bb1.Mi365Main.View @extends Backbone.View
	return Backbone.View.extend({

		template: safeaid_bb1_mi365dashboard_tpl

	,	initialize: function (options) {

			
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