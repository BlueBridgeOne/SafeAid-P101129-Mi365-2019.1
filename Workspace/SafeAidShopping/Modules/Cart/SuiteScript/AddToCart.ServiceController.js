define(
	'SafeAid.bb1.AddToCart.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.AddToCart.ServiceController',
			get: function get() {
				nlapiLogExecution("debug", "SafeAid.bb1.AddToCart.ServiceController.get " + request);

				var context = nlapiGetContext();
				var contact = context.getContact();
				var results={
					areas: [],
					wearers: []
				};
				if (!(contact > 0)) {
					return results;
				}
				var customer = context.getUser();
				//nlapiLogExecution("debug", "context", context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());

				var custentity_bb1_sca_allowviewareas = nlapiLookupField('contact', contact, 'custentity_bb1_sca_allowviewareas');
				if(custentity_bb1_sca_allowviewareas==null){
					custentity_bb1_sca_allowviewareas="0";
				}
				var allowAreas = custentity_bb1_sca_allowviewareas.split(",");

				var filter = [
					["custrecord_bb1_sca_area_company", "anyof", customer],
					"AND",
					["isinactive", "is", "F"],
					"AND",
					["internalid", "anyof", allowAreas]

				];
				var find = [];
				find.push(new nlobjSearchColumn("name"));

				// nlapiLogExecution("debug", "filter", JSON.stringify(filter));
				// nlapiLogExecution("debug", "find", JSON.stringify(find));


				var contactSearch = nlapiSearchRecord("customrecord_bb1_sca_area", null,
					filter,
					find
				);
				var result;
				if (contactSearch) {
					for (var i = 0; i < contactSearch.length; i++) {
						result = contactSearch[i];
						results.areas.push({
							value: result.getId(),
							text: result.getValue("name")
						});
					}
				}

				filter = [
					["custrecord_bb1_sca_wearer_area", "anyof", allowAreas],
					"AND",
					["isinactive", "is", "F"]

				];
				
				find.push(new nlobjSearchColumn("custrecord_bb1_sca_wearer_area"));

				contactSearch = nlapiSearchRecord("customrecord_bb1_sca_wearer", null,
					filter,
					find
				);
				
				if (contactSearch) {
					for (var i = 0; i < contactSearch.length; i++) {
						result = contactSearch[i];
						results.wearers.push({
							value: result.getId(),
							text: result.getValue("name"),
							area:result.getValue("custrecord_bb1_sca_wearer_area")
						});
					}
				}

				return results;
			}


		});
	}
);