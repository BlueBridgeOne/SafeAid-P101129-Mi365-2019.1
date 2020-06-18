/**
 * Project : MS
 * 
 * Description : Stop the website changing the default shipping item.
 * Note: This is a horribly hacky workaround because SCA won't trigger any scripts and won't give permission to work in the order.
 * 
 * @Author : Gordon Truslove
 * @Date   : 6/17/2020, 5:02:44 PM
 * 
 * Copyright (c) 2019 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

function(record, search) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
    
       	if (scriptContext.type == scriptContext.UserEventType.DELETE) return;
    	
    	var currentRecord = scriptContext.newRecord;
        var shippingitem = currentRecord.getValue({fieldId: 'shippingitem'});
        var custentity_bb1_sca_shippingitem = currentRecord.getValue({fieldId: 'custentity_bb1_sca_shippingitem'});

        if(shippingitem!=custentity_bb1_sca_shippingitem){
            currentRecord.setValue({fieldId: 'custentity_bb1_sca_shippingitem',value:shippingitem,ignoreFieldChange:true});
        }

    }

    return {
        beforeSubmit: beforeSubmit
    };
    
});

