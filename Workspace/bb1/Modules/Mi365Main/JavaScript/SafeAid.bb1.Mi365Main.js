/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Mi365Main', ['Handlebars',
		 'SafeAid.bb1.Mi365Router'
	],
	function (
		Handlebars,Mi365Router
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function(obj) {
			return JSON.stringify(obj, null, 3);
		});

		return {
			mountToApp: function mountToApp(container) {
				// using the 'Layout' component we add a new child view inside the 'Header' existing view 
				// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
				// more documentation of the Extensibility API in
				// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html

				/** @type {LayoutComponent} */
				var layout = container.getComponent('Layout');

				
	
				if (layout) {
					// layout.addChildView('Header.Logo', function () {
					// 	return new Mi365MainView({
					// 		container: container
					// 	});
					// });

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