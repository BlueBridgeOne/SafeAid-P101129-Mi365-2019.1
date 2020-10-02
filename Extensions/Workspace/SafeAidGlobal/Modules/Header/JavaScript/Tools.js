define('Tools',
  [
    'Backbone',
    'underscore',
    'Utils'
  ],
  function (Backbone, _, Utils) {

    var approveCart = function (application) {

        var CartApprovalView=require('bb1.Cart.Approval.View');
        var CartApprovalModel=require('SafeAid.bb1.CartApproval.Model');

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
function showInputInModal(application, title, message,value,success) {

    var view = new Backbone.View({
        application: application
    });

    view.title = title;
    view.render = function () {
        this.$el.append('<p class="success-message">' + message + '</p><p><input /></p><br /><div class="text-center"><button class="button-primary button-large confirm" data-dismiss="modal" >' + _('Update').translate() + '</button></div>');
        var self=this;
        this.$el.find(".confirm").click(function(){
            var $input=self.$el.find("input");
            success($input.val());
        });

        
        
        setTimeout(function(){
            var $input=self.$el.find("input");
            $input.focus();
            $input.val(value||"");

            $input.keypress(function(e) {
                if(e.which == 13) {
                    self.$el.find(".confirm").click();
                }
            });

        },500);
        
    };
    
    view.showInModal();
}
  
  // Make Tools module available globally
  var Tools = SC.Tools = {
      showErrorInModal: showErrorInModal,
      showSuccessInModal: showSuccessInModal,
      showConfirmInModal:showConfirmInModal,
      showInputInModal:showInputInModal,
      approveCart: approveCart
    }
    return Tools;
  }
);