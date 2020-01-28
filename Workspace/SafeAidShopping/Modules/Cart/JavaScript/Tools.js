define('Tools',
  [
    'Backbone',
    'underscore',
    'Utils',
    'bb1.Cart.Approval.View',
    'SafeAid.bb1.CartApproval.Model',
    'ErrorManagement.InternalError.View'
  ],
  function (Backbone, _, Utils, CartApprovalView, CartApprovalModel,InternalError) {

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
          
          showConfirmInModal(application, _('Checkout').translate(), _(res&&res.responseJSON&&res.responseJSON.errorMessage).translate(),function(){
            document.location=SC.SESSION.touchpoints.login+"&origin=home";
          });
      }
      });

    }
    

    function showErrorInModal(application, title, message) {

      var view = new Backbone.View({
          application: application
      });

      view.title = title;
      view.render = function () {
          this.$el.append('<p class="error-message">' + message + '</p><br /><div class="text-center"><button class="button-primary button-large" data-dismiss="modal">' + _('OK').translate() + '</button></div>');
      };
      view.showInModal();
  }

  function showSuccessInModal(application, title, message) {

      var view = new Backbone.View({
          application: application
      });

      view.title = title;
      view.render = function () {
          this.$el.append('<p class="success-message">' + message + '</p><br /><div class="text-center"><button class="button-primary button-large" data-dismiss="modal">' + _('OK').translate() + '</button></div>');
      };
      view.showInModal();
  }

  function showConfirmInModal(application, title, message,success) {

      var view = new Backbone.View({
          application: application
      });

      view.title = title;
      view.render = function () {
          this.$el.append('<p class="success-message">' + message + '</p><br /><div class="text-center"><button class="button-primary button-large confirm" data-dismiss="modal" >' + _('Confirm').translate() + '</button></div>');

          this.$el.find(".confirm").click(success);
      };
      view.showInModal();
  }

  
  // Make Tools module available globally
  var Tools = SC.Tools = {
      showErrorInModal: showErrorInModal,
      showSuccessInModal: showSuccessInModal,
      showConfirmInModal:showConfirmInModal,
      approveCart: approveCart
    }
    return Tools;
  }
);