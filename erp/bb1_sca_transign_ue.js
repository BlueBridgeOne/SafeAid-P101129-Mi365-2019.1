/**
 * Project : P101129
 * 
 * Description : View a signature recorded on the web store. The signature is a JSON objected s= start or move, w=width or speed.
 * 
 * @Author : Gordon Truslove
 * @Date   : 8/29/2019, 10:51:28 AM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget'],

    function (serverWidget) {

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
            var custrecord_bb1_sca_costocktrans_confirme = currentRecord.getValue({
                fieldId: 'custrecord_bb1_sca_costocktrans_confirme'
            });

            
            if (custrecord_bb1_sca_costocktrans_confirme) {
                var custrecord_bb1_sca_costocktrans_sign = currentRecord.getValue({
                    fieldId: 'custrecord_bb1_sca_costocktrans_sign'
                });
                if (custrecord_bb1_sca_costocktrans_sign && custrecord_bb1_sca_costocktrans_sign.length > 0) {

                    var field = scriptContext.form.addField({
                        id: 'custpage_sign',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'Signature'
                    });
                    var body = "";
                    body += "<div class=\"uir-field-wrapper\" style=\"margin-top:5px;\"><span class=\"smallgraytextnolink uir-label\"><a class=\"smallgraytextnolink\">Signature</a></span>";
                    body += "<canvas id=\"mySignCanvas\" style=\"max-width:300px;max-height:150px;border:1px solid #CCC;width:100%;\" width=\"600\" height=\"300\" /></canvas>";
                    body += "<script>";
                    body += "var canvas = document.getElementById(\"mySignCanvas\");";
                    body += "var ctx = canvas.getContext(\"2d\");";
                    body += "var point, lastPoint, c;";
				
					body += "var signature = "+custrecord_bb1_sca_costocktrans_sign+";";
					body += "for (var i = 0; i < signature.length; i++) {";
						body += "point = signature[i];";
						body += "if (!point.s) {";
							body += "lastPoint = signature[i - 1];";
							body += "ctx.beginPath();";
							body += "ctx.lineCap = \"round\";";
							body += "ctx.lineWidth = point.w;";
							body += "c = 120 - (20 * point.w);";
							body += "ctx.strokeStyle = \"rgb(\" + c + \",\" + c + \",\" + c + \")\";";

							body += "ctx.moveTo(lastPoint.x, lastPoint.y);";
							body += "ctx.lineTo(point.x, point.y);";
							body += "ctx.stroke();";
                            body += "}";
                            body += "}";
                
                
                    body += "</script>";
                    body += "</div>";
                    field.defaultValue = body;
                }
            }else{
                var field = scriptContext.form.getField({
                    id : 'custrecord_bb1_sca_costocktrans_confname'
                });
                field.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });
                field = scriptContext.form.getField({
                    id : 'custrecord_bb1_sca_costocktrans_confdate'
                });
                field.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });

                if(scriptContext.type=="create"){
                    field = scriptContext.form.getField({
                        id : 'custrecord_bb1_sca_costocktrans_confirme'
                    });
                    field.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                }
            }

        }

        return {
            beforeLoad: beforeLoad
        };

    });