// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Rules.View', [
	'safeaid_bb1_mi365rules.tpl', 'SafeAid.bb1.Mi365Rules.Model', 'Utils', 'Backbone', 'jQuery', 'underscore','Mi365Overview'
], function (
	safeaid_bb1_mi365rules_tpl, Mi365RulesModel, Utils, Backbone, jQuery, _,Mi365Overview
) {
	'use strict';

	return Backbone.View.extend({

		template: safeaid_bb1_mi365rules_tpl

			,
		initialize: function (options) {
			this.application = options.application;
			this.wearer = options.wearer;
			this.area = options.area;
			this.overview=Mi365Overview.get();
			var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});
		},
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
			var self =this;
			var model = new Mi365RulesModel();

			model.fetch({
				data: {
					task: "new",
					area:self.area,
					wearer:self.wearer,
					t: new Date().getTime()
				}
			}).done(function () {
				console.log("created new");
				Backbone.history.navigate('Mi365/rule/' + model.get("id"), {
					trigger: true
				});
			});
		},
		goToRecord: function (e) {
				var id = e.currentTarget.getAttribute("data-id");
				if (id) {
					Backbone.history.navigate('Mi365/rule/' + id, {
						trigger: true
					});
				}
			}

			//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
			,
		getContext: function getContext() {
			
			var allowEdit=this.overview.get("custentity_bb1_sca_alloweditrules")=="T";

			var title = "All",
				active = "All",
				breadcrumbs = [],
				model;

			//Try to work out the name of the area or wearer as don't know how to add that to a collection.
			for (var i = 0; i < this.collection.models.length; i++) {
				model = this.collection.models[i];
				if (this.wearer) {
					title = model.get("custrecord_bb1_sca_rule_wearer").text;
					break;
				} else if (this.area) {
					title = model.get("custrecord_bb1_sca_rule_area").text;
				}
				break;
			}
			if (this.wearer) {
				if (title == "All") {
					title == "Wearer";
				}
				active = "Rule";
				breadcrumbs = [{
					href: "Mi365/wearer/" + this.wearer,
					label: "Wearer"
				}];
			} else if (this.area) {
				if (title == "All") {
					title == "Area";
				}
				active = "Rule";
				breadcrumbs = [{
					href: "Mi365/area/" + this.area,
					label: "Area"
				}];
			}
			return {
				title: title + " Rules",
				breadcrumbs: breadcrumbs,
				showNew: allowEdit,
				models: this.collection.models,
				active: active
			};
		}
	});
});