
define('SafeAid.bb1.Mi365Wearers.Collection',
  [
  'Backbone',
  'SafeAid.bb1.Mi365Wearers.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl(Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Wearers.Service.ss')))
    });
  }
);