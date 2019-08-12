define(
	'SafeAid.bb1.Mi365Buyers.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Buyers.ServiceController'

				// The values in this object are the validation needed for the current service.
				,
			options: {
				common: {}
			}

			,
			get: function get() {
					nlapiLogExecution("debug", "SafeAid.bb1.Mi365Buyers.ServiceController.get "+request);

					return [{b:2}];
				}

				,
			post: function post() {
					// not implemented
				}

				,
			put: function put() {
					// not implemented
				}

				,
			delete: function () {
				// not implemented
			}
		});
	}
);