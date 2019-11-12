// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Report.View', [
	'SafeAid.bb1.Mi365Reports.Model',
	'safeaid_bb1_mi365report.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	Mi365ReportsModel,
	safeaid_bb1_mi365report_tpl,
	Utils,
	Backbone,
	Tools,
	BackboneFormView,
	jQuery,
	_
) {
	'use strict';


	return Backbone.View.extend({

		template: safeaid_bb1_mi365report_tpl,
		
		initialize: function (options) {
this.overview=options.overview;
				
				this.application = options.application;
			}

			,
		
		getContext: function getContext() {
			//var allowEdit=this.overview.get("custentity_bb1_sca_alloweditreports")=="T";
			var id=this.model.get("id");
			var total=0,lines=this.model.get("lines");
			for(var i=0;i<lines.length;i++){
				if(id=="spend-per-buyer"){
					total+=parseFloat(lines[i].total);
				}else{
					total+=parseFloat(lines[i].amount);
				}
			}

			return {
				total:total.toFixed(2),
				lines: this.model.get("lines"),
				name: this.model.get("name"),
				showBuyers:id=="spend-per-buyer",
				showAreas:id=="spend-per-area",
				showWearers:id=="spend-per-wearer",
				showItems:id=="spend-per-wearer"||id=="spend-per-area"
			};
		}
	});
});