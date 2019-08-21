
define('SafeAid.bb1.Mi365Areas.Collection',
  [
  'Backbone',
  'SafeAid.bb1.Mi365Areas.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl(Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Areas.Service.ss')))
    });
  }
);