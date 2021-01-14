/**
 * Project :
 * 
 * Description : 
 * 
 * @Author : Gordon Truslove
 * @Date   : 12/15/2020, 1:45:01 PM
 * 
 * Copyright (c) 2019 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

    function (record, search) {


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

            var shipstatus = currentRecord.getValue({
                fieldId: "shipstatus"
            });
            var oldshipstatus = currentRecord.getValue({
                fieldId: "shipstatus"
            });
            if (shipstatus == "C") {

            }

        }


        return {
            beforeSubmit: beforeSubmit
        };

    });