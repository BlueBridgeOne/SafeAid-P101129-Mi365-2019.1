// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Alerts.View', [
	'safeaid_bb1_mi365alerts.tpl', 'SafeAid.bb1.Mi365Alerts.Model', 'Utils', 'Backbone', 'jQuery', 'underscore'
], function (
	safeaid_bb1_mi365alerts_tpl, Mi365AlertsModel, Utils, Backbone, jQuery, _
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365alerts_tpl
		,title:"Mi365 Alerts"
			,
		initialize: function (options) {

			}

			,
		events: {
			'click [data-action="go-to-record"]': 'goToRecord',
			'click [data-action="clear"]': 'clearRecords'
		},
		clearRecords: function (e) {
			console.log("clear Records");
			var model = new Mi365AlertsModel();


			model.fetch({
				data: {
					task: "clear",
					t: new Date().getTime()
				}
			}).done(function () {
				console.log("cleared");
				Backbone.history.navigate('Mi365/alerts', {
					trigger: false
				});
			});
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('Mi365/alert/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			return {
				models: this.collection.models
			};
		}
	});
});