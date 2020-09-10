//@module Article - BB1 GTruslove Nov 2017 - Connect to article records. Data model.
define('SafeAid.bb1.Mi365Reports.Model',
  [
  'Backbone',
  'underscore',
  'Utils'
  ],
  function (Backbone, _,Utils) {
    return Backbone.CachedModel.extend({
      urlRoot: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/Mi365Reports.Service.ss'))
    });
  }
);