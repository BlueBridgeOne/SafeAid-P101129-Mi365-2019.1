/**
 * Project : MS
 * 
 * Description : Stop the website changing the default shipping item.
 * Note: This is a horribly hacky workaround because SCA won't trigger any scripts and won't give permission to work in the order.
 * 
 * @Author : Gordon Truslove
 * @Date   : 6/17/2020, 4:24:30 PM
 * 
 * Copyright (c) 2019 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/runtime', 'N/record', 'N/search'],

	function (serverWidget, runtime, record, search) {

		/**
		 * Definition of the Suitelet script trigger point.
		 *
		 * @param {Object} context
		 * @param {ServerRequest} context.request - Encapsulation of the incoming request
		 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
		 * @Since 2015.2
		 */
		function onRequest(context) {

			log.debug("shipping item!");
			var request = context.request;
			var customer = request.parameters.customer;

			if (customer) {

				var custentity_bb1_sca_shippingitem = search.lookupFields({
					type: search.Type.CUSTOMER,
					id: customer,
					columns: ['custentity_bb1_sca_shippingitem']
				});
				custentity_bb1_sca_shippingitem = custentity_bb1_sca_shippingitem.custentity_bb1_sca_shippingitem;
				if (custentity_bb1_sca_shippingitem.length > 0) {
					custentity_bb1_sca_shippingitem = custentity_bb1_sca_shippingitem[0].value;
					log.debug("custentity_bb1_sca_shippingitem", JSON.stringify(custentity_bb1_sca_shippingitem));

					record.submitFields({
						type: record.Type.CUSTOMER,
						id: customer,
						values: {
							shippingitem: custentity_bb1_sca_shippingitem
						},
						options: {
							enableSourcing: false,
							ignoreMandatoryFields: true
						}
					});
				}
				context.response.write({
					output: 'ok'
				});
			} else {
				context.response.write({
					output: 'did nothing'
				});
			}


		}

		return {
			onRequest: onRequest
		};

	})