/**
 * Project : P101129
 * 
 * Description : Change item image filenames into SCA format.
 * Note: Run this scheduled script to fix any new images in the SCA image folder.
 * 
 * @Author : Gordon Truslove
 * @Date   : 11/21/2019, 12:20:00 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime', 'N/file'],

    function (record, search, runtime, file) {

        /**
         * Execute the scheduled script.
         *
         * @context.type Execution type
         */
        function execute(context) {
            log.debug("context", context.type);
            var imagedir = 86139;

            var fileSearchObj = search.create({
                type: "file",
                filters: [
                    ["folder", "anyof", imagedir]
                ],
                columns: [
                    search.createColumn({
                        name: "name"
                    }),
                    search.createColumn({
                        name: "folder"
                    })
                ]
            });
            var filename, parts, lastpart, newname;
            fileSearchObj.run().each(function (result) {
                filename = result.getValue("name");


                if (filename.indexOf("_") == -1) {
                    log.debug("file", filename);


                    parts = filename.split('.');
                    lastpart = parts[parts.length - 2];
                    newname = "";
                    for (var j = 0; j < parts.length; j++) {
                        newname += parts[j];
                        if (j < parts.length - 1) {
                            if (lastpart.charAt(0) != lastpart.charAt(0).toLowerCase()) {
                                if (j == parts.length - 3) {
                                    newname += "_";
                                } else {
                                    newname += ".";
                                }
                            } else {
                                if (j == parts.length - 2) {
                                    newname += "_1.";
                                } else {
                                    newname += ".";
                                }
                            }
                        }
                    }
                    log.debug("change", filename + " to " + newname);
                    //             File.Move(f[i], Path.GetDirectoryName(f[i]) + "/" + newname);

                    var fileObj = file.load({
                        id: result.id
                    });
                    fileObj.name = newname;
                    fileObj.save();
                } else if (filename.indexOf("_1") == -1) {
                    parts = filename.split('.');
                    if (parts.length == 2) {
                        //Broken!!!
                        log.debug("fix file", filename);

                        parts[0] = parts[0].replace("_", ".");
                        parts[0] = parts[0] + "_1";
                        newname = parts.join(".");
                        log.debug("change", filename + " to " + newname);
                        var fileObj = file.load({
                            id: result.id
                        });
                        fileObj.name = newname;
                        fileObj.save();
                    }

                } else if (filename.indexOf("inuse_1") > -1 ||filename.indexOf("closed_1") > -1 ||filename.indexOf("open_1") > -1 ||filename.indexOf(" Clear_1") > -1 ||filename.indexOf(" Grey_1") > -1 ||filename.indexOf(" Yellow_1") > -1 ||filename.indexOf(" _") > -1 || filename.indexOf(" 2") > -1 || filename.indexOf(" 1") > -1 || filename.indexOf(" NEW_1") > -1 || filename.indexOf(" New_1") > -1 || filename.indexOf(" Closed_1") > -1 || filename.indexOf(" Open_1") > -1 || filename.indexOf(" Inside_1") > -1 || filename.indexOf(" Old_1") > -1 || filename.indexOf(" - 1_1") > -1 || filename.indexOf(" - 2_1") > -1 || filename.indexOf(" - 3_1") > -1 || filename.indexOf(" Side view_1") > -1 || filename.indexOf(" Front view_1") > -1 || filename.indexOf(" inset_1") > -1 || filename.indexOf(" open_1") > -1 || filename.indexOf(" closed_1") > -1 || filename.indexOf(" prop_1") > -1 || filename.indexOf(" 4._1") > -1 || filename.indexOf(" 3._1") > -1 || filename.indexOf(" 2._1") > -1 || filename.indexOf(" 1._1") > -1 || filename.indexOf("-B_1") > -1 || filename.indexOf("-F_1") > -1 || filename.indexOf(" 1 _1") > -1 || filename.indexOf(" 3 _1") > -1 || filename.indexOf(" 2 _1") > -1 || filename.indexOf(" (2)_1") > -1 || filename.indexOf(" (3)_1") > -1 || filename.indexOf(" (4)_1") > -1 || filename.indexOf("-1_1") > -1 || filename.indexOf("-2_1") > -1 || filename.indexOf("-3_1") > -1 || filename.indexOf("-4_1") > -1 || filename.indexOf("-5_1") > -1 || filename.indexOf("-6_1") > -1 || filename.indexOf("-7_1") > -1 || filename.indexOf("-8_1") > -1 || filename.indexOf("-1b_1") > -1) {

                    //Broken!!!
                    log.debug("fix file", filename);
                    newname = filename.replace(" (2)_1", "_2");
                    newname = newname.replace(" Old_1", "_Old");
                    newname = newname.replace(" (3)_1", "_3");
                    newname = newname.replace(" (4)_1", "_4");
                    newname = newname.replace(" - 1_1", "_1");
                    newname = newname.replace(" - 2_1", "_2");
                    newname = newname.replace(" - 3_1", "_3");
                    newname = newname.replace("-F_1", "_F");
                    newname = newname.replace("-B_1", "_B");
                    newname = newname.replace("-1_1", "_1");
                    newname = newname.replace("-2_1", "_2");
                    newname = newname.replace("-3_1", "_3");
                    newname = newname.replace("-4_1", "_4");
                    newname = newname.replace("-5_1", "_5");
                    newname = newname.replace("-6_1", "_6");
                    newname = newname.replace("-7_1", "_7");
                    newname = newname.replace("-8_1", "_8");
                    newname = newname.replace("-1b_1", "_1b");
                    newname = newname.replace(" 1._1", "_1");
                    newname = newname.replace(" 2._1", "_2");
                    newname = newname.replace(" 3._1", "_3");
                    newname = newname.replace(" 4._1", "_4");
                    newname = newname.replace(" prop_1", "_prop");
                    newname = newname.replace(" closed_1", "_closed");
                    newname = newname.replace(" open_1", "_open");
                    newname = newname.replace(" inset_1", "_inset");
                    newname = newname.replace(" Front view_1", "_f");
                    newname = newname.replace(" Side view_1", "_s");
                    newname = newname.replace(" Inside_1", "_inside");
                    newname = newname.replace(" Open_1", "_open");
                    newname = newname.replace(" Closed_1", "_closed");
                    newname = newname.replace(" NEW_1", "_new");
                    newname = newname.replace(" New_1", "_new");
                    newname = newname.replace(" 1_1", "_1");
                    newname = newname.replace(" 2_1", "_2");
                    newname = newname.replace(" _", "_");
                    newname = newname.replace(" Yellow_1", "_yellow");
                    newname = newname.replace(" Grey_1", "_grey");
                    newname = newname.replace(" Clear_1", "_clear");
                    newname = newname.replace("closed_1", "_closed");
                    newname = newname.replace("open_1", "_open");
                    newname = newname.replace("inuse_1", "_inuse");
                    if (newname.indexOf("-") > -1) {
                        newname = newname.replace("_1", "");
                        newname = newname.replace("-", "_");
                    }
                    log.debug("change", filename + " to " + newname);
                    var fileObj = file.load({
                        id: result.id
                    });
                    fileObj.name = newname;
                    fileObj.save();


                } else if (filename.indexOf(" ") > -1 || filename.indexOf("-") > -1) {

                    //Broken!!!
                    log.debug("problem file", filename);
                    if (filename.indexOf("-") > -1) {
                        newname = filename.replace("_1", "");
                        newname = newname.replace("-", "_");
                        log.debug("change", filename + " to " + newname);
                        var fileObj = file.load({
                            id: result.id
                        });
                        fileObj.name = newname;
                        fileObj.save();
                    }

                }

if(86139!=result.getValue("folder")){
    log.debug("folder",result.getValue("folder")+" "+filename);
    var fileObj = file.load({
        id: result.id
    });
    fileObj.folder = 86139;
    fileObj.save();
}

                return true;
            });






        }

        return {
            execute: execute
        };

    });