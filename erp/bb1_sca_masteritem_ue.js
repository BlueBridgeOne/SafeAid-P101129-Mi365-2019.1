/**
 * Project : P101129
 * 
 * Description : Turn an "Other Charge" item into a master item.
 * 
 * @Author : Gordon Truslove
 * @Date   : 7/16/2019, 2:29:23 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/url', 'N/ui/serverWidget'],

    function (record, url, serverWidget) {

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

            if (scriptContext.type == scriptContext.UserEventType.DELETE) {
                return;
            }

            var currentRecord = scriptContext.newRecord;
            if (currentRecord.type != "otherchargeitem") {
                return;
            }
            //var duedate = currentRecord.getValue({fieldId: 'duedate'});
            //log.debug("currentRecord", currentRecord.type);
            var form = scriptContext.form;
            var hide = ["itemoptions", "parent"],
                field;
            for (var i = 0; i < hide.length; i++) {
                field = form.getField({
                    id: hide[i]
                });
                field.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
            }
            if (scriptContext.type != scriptContext.UserEventType.CREATE) {
                form.addButton({
                    id: 'custpage_build',
                    label: 'Build',
                    functionName:'bb1_builditem'
                });
            }


            var titleField = form.addField({
                id: 'custpage_title',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Title'
            });
            //var html="<div class=\"uir-page-title\"><div class=\"page-title-menu noprint\"><div class=\"uir-record-icon\"><img src=\"/uirefresh/img/recordicon/item.svg\" alt=\"\"></div><div class=\"uir-page-title-firstline\" style=\"display:inline-block;\"><h2 class=\"uir-record-type\" >Master Item</h2></div></div>";
            var html="";//
            if (scriptContext.type == scriptContext.UserEventType.VIEW) {
                html+= "<style>#tbl_convertinvt,.uir-multibutton{display:none;}</style>";
            }

            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_bb1_sca_builditem',
                deploymentId: 'customdeploy_bb1_sca_builditem',
                returnExternalUrl: false
            });

            
            html += "<script>var dash=document.title.indexOf('-');document.title='Master Item '+document.title.substring(dash);document.getElementsByTagName('h1')[0].innerHTML='Master Item';";
            html += "function bb1_builditem(){";
            html += "document.location='"+suiteletUrl+"&item='+"+currentRecord.id+";";
            html += "}";
            html += "</script>";
            titleField.defaultValue = html;
            titleField.updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
            });


        }

        return {
            beforeLoad: beforeLoad
        };

    });