// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Buyers.View', [
	'safeaid_bb1_mi365buyers.tpl', 'SafeAid.bb1.Mi365Buyers.Model', 'Utils', 'Backbone', 'jQuery', 'underscore'
], function (
	safeaid_bb1_mi365buyers_tpl, Mi365BuyersModel, Utils, Backbone, jQuery, _
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365buyers_tpl

			,
		initialize: function (options) {

			}

			,
		events: {
			'click [data-action="go-to-record"]': 'goToRecord',
			'click [data-action="new"]': 'newRecord'
		},
		newRecord: function (e) {
			console.log("new Record");
			var model = new Mi365BuyersModel();


			model.fetch({
				data: {
					task: "new",
					t: new Date().getTime()
				}
			}).done(function () {
				console.log("created new");
				Backbone.history.navigate('#Mi365/buyer/' + this.id, {
					trigger: true
				});
			});
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('#Mi365/buyer/' + id, {
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