//@module bb1.SafeAidGlobal.Menu
define(
    'bb1.SafeAidGlobal.EditPO',
    [
        'Profile.Model',
        'SC.Configuration',
        'underscore',
        'Utils',
        'Mi365Overview'
    ],
    function (
        ProfileModel,
        Configuration,
        _,
        Utils,
        Mi365Overview
    ) {
        'use strict';

        return {

            mountToApp: function (container) {

                if (SC.ENVIRONMENT.SCTouchpoint == "myaccount") {
var Tools=require('Tools');
var Mi365OrderModel=require('SafeAid.bb1.Mi365Order.Model');
                    var OrderHistoryDetailsView = require('OrderHistory.Details.View');
                    if (OrderHistoryDetailsView) {


                        OrderHistoryDetailsView.prototype.events['click [data-action="editPO"]'] = 'editPO';
                        OrderHistoryDetailsView.prototype.editPO = function (e) {
                            e.preventDefault();
                            var self = this;
                            Tools&&Tools.showInputInModal(container, this.model.get("tranid"), _("Update the purchase order number.").translate(), this.model.get("purchasenumber"), function (res) {

                                


                                console.log("update PO");
                                var model = new Mi365OrderModel();
                                model.on('error', _.bind(self.showError, this));

                                var orderId = self.model.id;
                                model.fetch({
                                    data: {
                                        id: orderId,
                                        task: "editPO",
                                        t: new Date().getTime(),
                                        purchasenumber: res
                                    }
                                }).done(function () {
                                    console.log("PO updated");
                                    self.model.set("purchasenumber", res);
                                self.render();

                                }).fail(function(err,res){
                                    self.showError(err||res,res||err);
                                });

                            });
                        }

                        OrderHistoryDetailsView.prototype.showError = function (err,res) {
                            try{
                                // console.log("err",err);
                                // console.log("res",res);
                            var message=err;
                            if(err.responseJSON){
                            message = err.responseJSON.errorMessage;
                            }

                            Tools&&Tools.showErrorInModal(container, _('Update Purchase Order Number').translate(), _(message).translate());
                            }catch(error){
                                alert(error);
                            }
                        }

                        _.extend(OrderHistoryDetailsView.prototype, {

                            initialize: _.wrap(OrderHistoryDetailsView.prototype.initialize, function (initialize, options) {
                                initialize.apply(this, _.rest(arguments));
                                this.overview = Mi365Overview.get();
                                var self = this;
                                Mi365Overview.done(function (model) {
                                    self.overview = model;
                                    self.render();
                                });
                            }),
                            getContext: _.wrap(OrderHistoryDetailsView.prototype.getContext, function (getContext, options) {
                                var res = getContext.apply(this, _.rest(arguments));
                                
                                var status=this.model.get("status").internalid;
                                
                                if(status!="fullyBilled"&&status!="closed"&&status!="cancelled"){
                                res.allowEditPO = this.overview.get("custentity_bb1_sca_allowapproveorders") == "T";
                                }
                                return res;
                            })
                        });

                    }
                }

            }

        };

    });