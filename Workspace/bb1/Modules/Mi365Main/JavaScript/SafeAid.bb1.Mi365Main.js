/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Mi365Main', ['Tools', 'Handlebars',
		'SafeAid.bb1.Mi365Router', 'OrderHistory.Details.View', 'OrderHistory.Summary.View', 'SafeAid.bb1.Mi365Order.Model', 'Balance.View',
		'Mi365Overview'
	],
	function (
		Tools, Handlebars, Mi365Router, OrderHistoryDetails, OrderHistorySummary, Mi365OrderModel, BalanceView, Mi365Overview
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj, null, 3);
		});

		return {
			mountToApp: function mountToApp(container) {

				//add permissions to balance

				_.extend(BalanceView.prototype, {

					initialize: _.wrap(BalanceView.prototype.initialize, function (initialize, options) {
						initialize.apply(this, _.rest(arguments));
						this.overview = Mi365Overview.get();
						var self = this;
						Mi365Overview.done(function (model) {
							self.overview = model;
							self.render();
						});
					}),
					getContext: _.wrap(BalanceView.prototype.getContext, function (getContext, options) {
						var res = getContext.apply(this, _.rest(arguments));
						res.allowView = this.overview.get("custentity_bb1_sca_allowviewbalance") == "T";
					})
				});



				//show approval info on order history.
				_.extend(OrderHistoryDetails.prototype, {

					getContext: _.wrap(OrderHistoryDetails.prototype.getContext, function (getContext, options) {
						var res = getContext.apply(this, _.rest(arguments));

						//console.log(res);
						var options = res.model.get("options");
						//console.log(options);
						if (options.custbody_bb1_sca_approvalstatus == "3") {
							res.showApproved = true;
						} else if (options.custbody_bb1_sca_approvalstatus == "2") {
							res.approvalRequired = true;
							var warnings = [];
							if (options.custbody_bb1_sca_approvaldata) {
								//console.log(options.custbody_bb1_sca_approvaldata);
								var custbody_bb1_sca_approvaldata = JSON.parse(options.custbody_bb1_sca_approvaldata);
								//console.log(custbody_bb1_sca_approvaldata.warnings);
								warnings = custbody_bb1_sca_approvaldata.warnings || []

								var warning, values;
								var durations = {
									"1": "month",
									"2": "quarter",
									"3": "year"
								};
								//console.log(warnings);
								for (var i = 0; i < warnings.length; i++) {
									warning = warnings[i];
									values = warning.values;

									switch (warning.message) {
										case "WARNING_BUYER_BUDGET":
											warning.text = "The order exceeded the buyers budget of £" + values.budget + " for this " + durations[values.duration] + ".";
											break;
										case "WARNING_AREA_BUDGET":
											warning.text = "The order exceeds " + values.area.text + "'s budget of £" + values.budget + " for this " + durations[values.duration] + ".";
											break;
										case "WARNING_WEARER_BUDGET":
											warning.text = "The order exceeds " + values.wearer.text + "'s budget of £" + values.budget + " for this " + durations[values.duration] + ".";
											break;
										case "WARNING_RULE_AREA_MAX":
											warning.text = "Only " + values.max + " " + values.item.text + "'s can be purchased for " + values.area.text + "'s during this " + durations[values.duration] + ".";
											break;
										case "WARNING_RULE_WEARER_MAX":
											warning.text = "Only " + values.max + " " + values.item.text + "'s can be purchased for " + values.wearer.text + " during this " + durations[values.duration] + ".";
											break;

									}
								}

							}
							res.warnings = warnings;
							console.log("show warnings");
							console.log(warnings);
						}

						return res;
					})
				});


				//show approve button on order history.
				_.extend(OrderHistorySummary.prototype, {

					getContext: _.wrap(OrderHistorySummary.prototype.getContext, function (getContext, options) {
						var res = getContext.apply(this, _.rest(arguments));
						var options = res.model.get("options");
						//console.log(options);
						if (options.custbody_bb1_sca_approvalstatus == "2") {
							res.approvalRequired = true;
						}
						return res;
					})
				});

				OrderHistorySummary.prototype.showError = function (err, res) {
					var message = res.responseJSON.errorMessage;
					Tools.showErrorInModal(this.application, _('Approval Failed!').translate(), _(message).translate());

				}

				OrderHistorySummary.prototype.events['click [data-action="approve"]'] = 'approve';
				OrderHistorySummary.prototype.approve = function (e) {
					console.log("approve order");
					var model = new Mi365OrderModel();
					model.on('error', _.bind(this.showError, this));

					var orderId = this.model.id;
					model.fetch({
						data: {
							id: orderId,
							task: "approve",
							t: new Date().getTime()
						}
					}).done(function () {
						console.log("approved order");
						Backbone.localCache = {};
						Backbone.history.loadUrl();
					});
				}


				var layout = container.getComponent('Layout');

				if (layout) {
					return new Mi365Router(layout.application);
				}


			},
			MenuItems: function () {
				return {
					id: 'mi365',
					name: _('Mi365').translate(),
					index: 1,
					children: [{
						id: 'dashboard',
						name: _('Dashboard').translate(),
						url: 'Mi365',
						index: 1
					}, {
						id: 'buyers',
						name: _('Buyers').translate(),
						url: 'Mi365/buyers',
						index: 2
					}, {
						id: 'areas',
						name: _('Areas').translate(),
						url: 'Mi365/areas',
						index: 3
					}, {
						id: 'wearers',
						name: _('Wearers').translate(),
						url: 'Mi365/wearers',
						index: 4
					}, {
						id: 'alerts',
						name: _('Alerts').translate(),
						url: 'Mi365/alerts',
						index: 5
					}, {
						id: 'reports',
						name: _('Reports').translate(),
						url: 'Mi365/reports',
						index: 6
					}]
				};
			}
		};
	});