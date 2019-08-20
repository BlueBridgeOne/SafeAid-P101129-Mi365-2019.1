/* BB1 G Truslove - reusable functions */

define('Tools', [
    'jQuery', 'Utils', 'underscore', 'SC.Configuration'
],
function (
    jQuery, Utils, _, Configuration
) {

    'use strict';

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

    
    // Make Tools module available globally
    var Tools = SC.Tools = {
        showErrorInModal: showErrorInModal,
        showSuccessInModal: showSuccessInModal
    }
    return Tools;
});