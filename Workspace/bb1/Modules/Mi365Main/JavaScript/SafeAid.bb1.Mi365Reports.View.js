// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Reports.View', [
	'safeaid_bb1_mi365reports.tpl', 'SafeAid.bb1.Mi365Reports.Model', 'Utils', 'Backbone', 'jQuery', 'underscore','Mi365Overview'
], function (
	safeaid_bb1_mi365reports_tpl, Mi365ReportsModel, Utils, Backbone, jQuery, _,Mi365Overview
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365reports_tpl

			,
		initialize: function (options) {
			this.overview=Mi365Overview.get();
			var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});
			}

			,
		events: {
			'click [data-action="go-to-record"]': 'goToReport'
		}
		,
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('Mi365/report/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			var allowView=this.overview.get("custentity_bb1_sca_allowviewreports")=="T";
			
			return {
				showView:allowView,
				reports: [
					{id:"spend-per-buyer",name:"Spend Per Buyer"},
					{id:"spend-per-area",name:"Spend Per Area"},
					{id:"spend-per-wearer",name:"Spend Per Wearer"}
				]
			};
		}
	});
});