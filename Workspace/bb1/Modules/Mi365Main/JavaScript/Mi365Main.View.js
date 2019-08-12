// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Main.View'
,	[
		'safeaid_bb1_mi365main.tpl'
	,	'Utils'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		safeaid_bb1_mi365main_tpl
	,	Utils
	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class SafeAid.bb1.Mi365Main.View @extends Backbone.View
	return Backbone.View.extend({

		template: safeaid_bb1_mi365main_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service 
				(you'll need to deploy and activate the extension first)
			*/
			this.message = '';
			// var service_url = Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Main.Service.ss'));

			// jQuery.get(service_url)
			// .then((result) => {

			// 	this.message = result;
			// 	this.render();
			// });
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
			//@class SafeAid.bb1.Mi365Main.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});