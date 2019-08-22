// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Stocks.View', [
	'safeaid_bb1_mi365stocks.tpl', 'SafeAid.bb1.Mi365Stocks.Model', 'Utils', 'Backbone', 'jQuery', 'underscore'
], function (
	safeaid_bb1_mi365stocks_tpl, Mi365StocksModel, Utils, Backbone, jQuery, _
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365stocks_tpl

			,
		initialize: function (options) {
this.application=options.application;
this.wearer=options.wearer;
this.area=options.area;
			}
			,
		events: {
			'click [data-action="go-to-record"]': 'goToRecord',
			'click [data-action="new"]': 'newRecord'
		},
		newRecord: function (e) {
			console.log("new Record");
			var model = new Mi365StocksModel();


			model.fetch({
				data: {
					task: "new",
					t: new Date().getTime()
				}
			}).done(function () {
				console.log("created new");
				Backbone.history.navigate('#Mi365/stock/' + this.id, {
					trigger: true
				});
			});
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('#Mi365/stock/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			var title="All Stock",active="All Stock",breadcrumbs=[];
			if(this.wearer){
				title="Wearer Stock";
				active="Stock";
				breadcrumbs=[{href:"#Mi365/wearer/"+this.wearer,label:"Wearer"}];
			}else if(this.area){
				title="Area Stock";
				active="Stock";
				breadcrumbs=[{href:"#Mi365/area/"+this.area,label:"Area"}];
			}
			return {
				title:title,
				breadcrumbs:breadcrumbs,
				models: this.collection.models,
			active:active
			};
		}
	});
});