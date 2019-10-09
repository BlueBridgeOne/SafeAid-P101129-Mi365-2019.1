/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Mi365Main', ['Handlebars',
		'SafeAid.bb1.Mi365Router', 'OrderHistory.Details.View'
	],
	function (
		Handlebars, Mi365Router, OrderHistoryDetails
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj, null, 3);
		});

		return {
			mountToApp: function mountToApp(container) {

				//show approval info on order history.
				_.extend(OrderHistoryDetails.prototype, {

					getContext: _.wrap(OrderHistoryDetails.prototype.getContext, function (getContext, options) {
						var res = getContext.apply(this, _.rest(arguments));
						console.log(res);
						var options = res.model.get("options");
						//console.log(options);
						if (options.custbody_bb1_sca_approvalstatus == "3") {
							res.showApproved = true;
						} else if (options.custbody_bb1_sca_approvalstatus == "2") {
							res.approvalRequired = true;
							var warnings = [];
							if (options.custbody_bb1_sca_approvaldata) {
								console.log(options.custbody_bb1_sca_approvaldata);
								var custbody_bb1_sca_approvaldata = JSON.parse(options.custbody_bb1_sca_approvaldata);
								console.log(custbody_bb1_sca_approvaldata.warnings);
								warnings = custbody_bb1_sca_approvaldata.warnings || []

								var warning;
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
											warning.text = "The order exceeds your budget of £" + values.budget + " for this " + durations[values.duration] + ".";
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
							res.warnings=warnings;
							console.log(warnings);
						}
						return res;
					})
				});



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
					}]
				};
			}
		};
	});