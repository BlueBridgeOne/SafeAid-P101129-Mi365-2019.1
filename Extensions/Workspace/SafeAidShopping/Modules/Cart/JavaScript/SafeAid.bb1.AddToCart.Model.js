define('SafeAid.bb1.AddToCart.Model',
  [
  'Backbone',
  'underscore',
  'Utils'
  ],
  function (Backbone, _,Utils) {
    return Backbone.CachedModel.extend({
      urlRoot: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/AddToCart.Service.ss'))
    });
  }
);