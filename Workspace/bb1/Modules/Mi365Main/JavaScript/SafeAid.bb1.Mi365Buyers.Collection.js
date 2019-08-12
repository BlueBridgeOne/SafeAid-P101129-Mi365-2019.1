
define('SafeAid.bb1.Mi365Buyers.Collection',
  [
  'Backbone',
  'SafeAid.bb1.Mi365Buyers.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl(Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Buyers.Service.ss')))
    });
  }
);