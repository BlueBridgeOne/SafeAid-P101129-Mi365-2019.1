// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Transfers.View', [
	'safeaid_bb1_mi365transfers.tpl', 'SafeAid.bb1.Mi365Transfers.Model', 'Utils', 'Backbone', 'jQuery', 'underscore'
], function (
	safeaid_bb1_mi365transfers_tpl, Mi365TransfersModel, Utils, Backbone, jQuery, _
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365transfers_tpl

			,
		initialize: function (options) {
			this.application = options.application;
			this.wearer = options.wearer;
			this.area = options.area;
			}

			,
		events: {
			'click [data-action="go-to-record"]': 'goToRecord'
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('#Mi365/transfer/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			var title = "All",
				active = "All",
				breadcrumbs = [],
				model;

			//Try to work out the name of the area or wearer as don't know how to add that to a collection.
			for (var i = 0; i < this.collection.models.length; i++) {
				model = this.collection.models[i];
				if (this.wearer) {
					title = model.get("custrecord_bb1_sca_costocktrans_wearer").text;
					break;
				} else if (this.area) {
					title = model.get("custrecord_bb1_sca_costocktrans_area").text;
				}
break;
			}
			if (this.wearer) {
				if (title == "All") {
					title == "Wearer";
				}
				active = "Transfers";
				breadcrumbs = [{
					href: "#Mi365/wearer/" + this.wearer,
					label: "Wearer"
				}];
			} else if (this.area) {
				if (title == "All") {
					title == "Area";
				}
				active = "Transfers";
				breadcrumbs = [{
					href: "#Mi365/area/" + this.area,
					label: "Area"
				}];
			}

			return {
				title: title + " Transfers",
				breadcrumbs: breadcrumbs,
				models: this.collection.models,
				active: active
			};
		}
	});
});