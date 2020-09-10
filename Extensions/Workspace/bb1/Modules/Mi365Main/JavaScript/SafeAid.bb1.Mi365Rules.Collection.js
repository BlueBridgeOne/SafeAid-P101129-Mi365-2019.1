
define('SafeAid.bb1.Mi365Rules.Collection',
  [
  'Backbone',
  'SafeAid.bb1.Mi365Rules.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Rules.Service.ss'))
    });
  }
);