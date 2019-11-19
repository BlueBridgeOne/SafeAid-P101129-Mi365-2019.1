/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Global', [
	'Handlebars','SafeAid.bb1.HeaderAlerts.View', 'Header.View'
	],
	function (
		Handlebars,HeaderAlertsView,Header
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj, null, 3);
		});

		return {
			mountToApp: function mountToApp(container) {

				Header.prototype.childViews.alerts=function(){
					return new HeaderAlertsView({application:container});
				}
			}
		};
	});