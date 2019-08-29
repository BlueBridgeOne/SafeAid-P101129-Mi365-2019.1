
define('SafeAid.bb1.Mi365Transfers.Collection',
  [
  'Backbone',
  'SafeAid.bb1.Mi365Transfers.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl(Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Transfers.Service.ss')))
    });
  }
);