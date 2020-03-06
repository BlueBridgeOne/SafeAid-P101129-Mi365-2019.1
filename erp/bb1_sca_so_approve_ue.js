/**
 * Description : Hide unused approval fields.
 * 
 * @Author : Gordon Truslove
 * @Date   : 11/8/2019, 1:31:26 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search','N/ui/serverWidget'],

function(record, search,serverWidget) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

       	if (scriptContext.type == scriptContext.UserEventType.DELETE) return;
    	
    	var currentRecord = scriptContext.newRecord;
        var custbody_bb1_sca_approver = currentRecord.getValue({fieldId: 'custbody_bb1_sca_approver'});
        if(!custbody_bb1_sca_approver){
            var field = scriptContext.form.getField({
                id : 'custbody_bb1_sca_approver'
            });
            field.updateDisplayType({
                displayType : serverWidget.FieldDisplayType.HIDDEN
            });
        }
        var custbody_bb1_sca_webapprover = currentRecord.getValue({fieldId: 'custbody_bb1_sca_webapprover'});
        if(!custbody_bb1_sca_webapprover){
            var field = scriptContext.form.getField({
                id : 'custbody_bb1_sca_webapprover'
            });
            field.updateDisplayType({
                displayType : serverWidget.FieldDisplayType.HIDDEN
            });
        }

    }

    return {
        beforeLoad: beforeLoad
    };
    
});

