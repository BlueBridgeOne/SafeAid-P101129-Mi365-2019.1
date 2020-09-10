define('SafeAid.bb1.CartApproval.Model',
  [
  'Backbone',
  'underscore',
  'Utils'
  ],
  function (Backbone, _,Utils) {
    return Backbone.CachedModel.extend({
      urlRoot: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/CartApproval.Service.ss'))
    });
  }
);