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