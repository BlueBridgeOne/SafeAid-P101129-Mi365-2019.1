// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Areas.View', [
	'safeaid_bb1_mi365areas.tpl', 'SafeAid.bb1.Mi365Areas.Model', 'Utils', 'Backbone', 'jQuery', 'underscore','Mi365Overview'
], function (
	safeaid_bb1_mi365areas_tpl, Mi365AreasModel, Utils, Backbone, jQuery, _,Mi365Overview
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365areas_tpl

			,
			title:"Mi365 Areas",
		initialize: function (options) {
			this.overview=Mi365Overview.get();
			var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});
			}

			,
		events: {
			'click [data-action="go-to-record"]': 'goToRecord',
			'click [data-action="new"]': 'newRecord'
		}
		,
		newRecord: function (e) {
			console.log("new Record");
			var model = new Mi365AreasModel();


			model.fetch({
				data: {
					task: "new",
					t: new Date().getTime()
				}
			}).done(function () {
				console.log("created new");
				Backbone.history.navigate('Mi365/area/' + model.get("id"), {
					trigger: true
				});
			});
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('Mi365/area/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			var allowEdit=this.overview.get("custentity_bb1_sca_alloweditareas")=="T";
			
			return {
				showNew:allowEdit,
				models: this.collection.models
			};
		}
	});
});