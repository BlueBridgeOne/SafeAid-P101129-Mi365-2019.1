
define('SafeAid.bb1.Mi365Stocks.Collection',
  [
  'Backbone',
  'SafeAid.bb1.Mi365Stocks.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl(Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Stocks.Service.ss')))
    });
  }
);