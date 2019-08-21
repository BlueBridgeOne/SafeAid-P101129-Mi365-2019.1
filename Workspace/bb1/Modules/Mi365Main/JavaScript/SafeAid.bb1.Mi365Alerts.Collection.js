
define('SafeAid.bb1.Mi365Alerts.Collection',
  [
  'Backbone',
  'SafeAid.bb1.Mi365Alerts.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl(Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Alerts.Service.ss')))
    });
  }
);