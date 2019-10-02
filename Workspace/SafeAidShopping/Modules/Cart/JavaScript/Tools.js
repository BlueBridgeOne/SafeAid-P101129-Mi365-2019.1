define('Tools',
  [
    'Backbone',
    'underscore',
    'Utils',
    'bb1.Cart.Approval.View',
    'SafeAid.bb1.CartApproval.Model'
  ],
  function (Backbone, _, Utils, CartApprovalView, CartApprovalModel) {

    var approveCart = function (application) {

      var model = new CartApprovalModel();
      var view = new CartApprovalView({
        model: model,
        application: application
      });
      var self=this;

      model.fetch({
        data: {
          t: new Date().getTime()
        },
        success: function () {
          var warnings=model.get("warnings");
          if(warnings.length>0){
          view.showInModal();
          }else{
            document.location=SC.SESSION.touchpoints.checkout;
          }
      },
        error: function (mod,res) {
          var errView=new InternalError({application: self.application,pageHeader:"Unable to View",title:"Unable to View",message:res&&res.responseJSON&&res.responseJSON.errorMessage});
          errView.showInModal();
      }
      });

    }
    

    var Tools = SC.Tools = {
      approveCart: approveCart
    }
    return Tools;
  }
);