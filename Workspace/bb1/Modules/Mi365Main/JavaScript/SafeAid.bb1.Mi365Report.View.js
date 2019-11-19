// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Report.View', [
	'SafeAid.bb1.Mi365Reports.Model',
	'safeaid_bb1_mi365report.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore',
	'Mi365Overview'
], function (
	Mi365ReportsModel,
	safeaid_bb1_mi365report_tpl,
	Utils,
	Backbone,
	Tools,
	BackboneFormView,
	jQuery,
	_,
	Mi365Overview
) {
	'use strict';


	return Backbone.View.extend({

		template: safeaid_bb1_mi365report_tpl,

		initialize: function (options) {
			this.overview=Mi365Overview.get();
			var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});

			this.application = options.application;
			this.selectedRange = {};
			this.selectedRange["to"] = this.formatDate(new Date());
			var from = new Date();
			from.setMonth(from.getMonth() - 1);
			this.selectedRange["from"] = this.formatDate(from);
		},
		events: {

			/*
			 * range-filter focus/blur work together to update the date range when:
			 * Blur happens on a field and user don't focus on the other during a defined interval
			 */
			'focus [data-action="range-filter"]': 'clearRangeFilterTimeout',
			'blur [data-action="range-filter"]': 'rangeFilterBlur',
			'change [data-action="filter"]': 'changeFilter'
		},
		destroy: function () {
				this.clearRangeFilterTimeout();
				this._destroy();
			} // @method rangeFilterBlur
			,
		changeFilter: function (e) {

			this.currentFilter = e.target.value;

			this.render();
		},
		rangeFilterBlur: function () {
				this.clearRangeFilterTimeout();
				this.rangeFilterTimeout = setTimeout(_.bind(this.rangeFilterHandler, this), 1000);
			}

			// @method clearRangeFilterTimeout
			,
		clearRangeFilterTimeout: function () {
				if (this.rangeFilterTimeout) {
					clearTimeout(this.rangeFilterTimeout);
					this.rangeFilterTimeout = null;
				}
			}

			// @method rangeFilterHandler
			,
		rangeFilterHandler: function () {
				var selected_range = this.selectedRange,
					$ranges = this.$('[data-action="range-filter"]');

				$ranges.each(function () {
					if (this.value) {
						selected_range[this.name] = this.value;
					} else {
						delete selected_range[this.name];
					}
				});

				//console.log(selected_range.to);
				//selected_range.from
				var self = this;
				var id = this.model.get("id");
				this.model.fetch({
					data: {
						id: id,
						t: new Date().getTime(),
						from: selected_range.from,
						to: selected_range.to
					},
					success: function () {
						self.render();
					}
				});


				return this;
			}

			,
		formatDate: function (d) {
			var month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) {
				month = '0' + month;
			}
			if (day.length < 2) {
				day = '0' + day;
			}

			return [year, month, day].join('-');
		},

		getContext: function getContext() {
			//var allowEdit=this.overview.get("custentity_bb1_sca_alloweditreports")=="T";
			var id = this.model.get("id");
			var total = 0,
				lines = this.model.get("lines");
			var hfilters = {},
				filters = [],
				filterid;
			switch (id) {
				case "spend-per-area":
					filterid = "custcol_bb1_transline_area";
					break;
				case "spend-per-wearer":
					filterid = "custcol_bb1_transline_wearer";
					break;
				case "spend-per-buyer":
					filterid = "custbody_bb1_buyer";
					break;
			}
			filters.unshift({
				value: "",
				text: "All"
			});

			var filtervalue, hasFilter = this.currentFilter && this.currentFilter != "";
			for (var i = 0; i < lines.length; i++) {
				filtervalue = lines[i][filterid];

				lines[i].show = !hasFilter || (filtervalue && this.currentFilter == filtervalue.value);
				if (lines[i].show) {
					if (id == "spend-per-buyer") {
						total += parseFloat(lines[i].total);
					} else {
						total += parseFloat(lines[i].amount);
					}
				}

				if (filtervalue) {
					if (!hfilters[filtervalue.value]) {
						hfilters[filtervalue.value] = true;
						filtervalue.selected = this.currentFilter == filtervalue.value;
						filters.push(filtervalue);
					}
				}
			}


			return {
				selectedRangeTo: this.selectedRange["to"],
				selectedRangeFrom: this.selectedRange["from"],

				total: total.toFixed(2),
				lines: lines,
				name: this.model.get("name"),
				showBuyers: id == "spend-per-buyer",
				showAreas: id == "spend-per-area",
				showWearers: id == "spend-per-wearer",
				showItems: id == "spend-per-wearer" || id == "spend-per-area",
				filters: filters,
				showFilters:filters.length>1
			};

		}
	});
});