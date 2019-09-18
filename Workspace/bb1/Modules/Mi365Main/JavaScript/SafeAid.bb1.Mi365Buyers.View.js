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
			this.overview=options.overview;
			}

			,
		events: {
			'click [data-action="go-to-record"]': 'goToRecord',
			'click [data-action="new"]': 'newRecord',
			'click a': 'stopBubble'
		},
		stopBubble:function(e){
			e.stopPropagation();
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
				Backbone.history.navigate('Mi365/buyer/' + model.get("id"), {
					trigger: true
				});
			});
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('Mi365/buyer/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			var allowEdit=this.overview.get("custentity_bb1_sca_alloweditbuyers")=="T";
			
			return {
				showNew:allowEdit,
				models: this.collection.models
			};
		}
	});
});