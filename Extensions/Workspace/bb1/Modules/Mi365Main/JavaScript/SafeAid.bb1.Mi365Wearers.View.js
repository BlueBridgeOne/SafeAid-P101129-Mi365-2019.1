// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Wearers.View', [
	'safeaid_bb1_mi365wearers.tpl', 'SafeAid.bb1.Mi365Wearers.Model', 'Utils', 'Backbone', 'jQuery', 'underscore','Mi365Overview'
], function (
	safeaid_bb1_mi365wearers_tpl, Mi365WearersModel, Utils, Backbone, jQuery, _,Mi365Overview
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365wearers_tpl

			,
			title:"Mi365 Wearers",
		initialize: function (options) {
			this.overview=Mi365Overview.get();
			var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});
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
			var model = new Mi365WearersModel();


			model.fetch({
				data: {
					task: "new",
					t: new Date().getTime()
				}
			}).done(function () {
				console.log("created new");
				Backbone.history.navigate('Mi365/wearer/' + model.get("id"), {
					trigger: true
				});
			});
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('Mi365/wearer/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			var allowEdit=this.overview.get("custentity_bb1_sca_alloweditwearers")=="T";
			
			return {
				showNew:allowEdit,
				models: this.collection.models
			};
		}
	});
});