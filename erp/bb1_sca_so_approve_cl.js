/**
 * bb1_sca_so_approve_cl
 * @NApiVersion 2.x
 * 
 * Project : P101128
 * 
 * Description : Approve Mi365 SO.
 * 
 * @Author : Gordon Truslove
 * @Date   : 10/3/2019, 10:43:44 AM
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 */
define([ 'N/url', 'N/currentRecord', 'N/runtime', 'N/record' ],

function(url, currentRecord, runtime, record) {

	function bb1_approve_so() { //Approve an article
		var R = currentRecord.get();

		var href = url.resolveRecord({
			recordType : 'salesorder',
			recordId : R.id,
			isEditMode : false
		});
		var user = runtime.getCurrentUser();
		
		var id = record.submitFields({
			type : 'salesorder',
			id : R.id,
			values : {
				custbody_bb1_sca_approver : user.id,
				custbody_bb1_sca_approvalstatus : 3
			},
			options : {
				enableSourcing : false,
				ignoreMandatoryFields : true
			}
		});

		document.location = href;
	}

	return {
		bb1_approve_so : bb1_approve_so
	};

});
