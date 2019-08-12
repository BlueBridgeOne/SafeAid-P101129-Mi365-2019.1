// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Alerts.View'
,	[
		'safeaid_bb1_mi365alerts.tpl'
	,	'Utils'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		safeaid_bb1_mi365alerts_tpl
	,	Utils
	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365alerts_tpl

	,	initialize: function (options) {

		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {
			
		}

		//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
	,	getContext: function getContext()
		{
			return {
				
			};
		}
	});
});