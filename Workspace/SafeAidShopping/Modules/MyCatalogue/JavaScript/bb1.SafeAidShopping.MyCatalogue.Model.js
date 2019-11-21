//@module bb1.SafeAidShopping.MyCatalogue
define('bb1.SafeAidShopping.MyCatalogue.Model',
 [
  'Item.Model',
  'Profile.Model',
  'Session',
  'SC.Configuration',

  'underscore',
  'Utils'
 ],
 function (
  ItemModel,
  ProfileModel,
  Session,
  Configuration,
  
  _,
  Utils
 )
{
 'use strict';

 //@class bb1.SafeAidShopping.MyCatalogue.Model @extend Item.Model
 return ItemModel.extend({
  
  searchApiMasterOptions: Configuration.get('searchApiMasterOptions.Facets', {}),

  url: function()
  {
   var profile = ProfileModel.getInstance(),
       url = _.addParamsToUrl(
        profile.getSearchApiUrl(),
        _.extend(
         (Configuration.get('matrixchilditems.enabled') && Configuration.get('matrixchilditems.fieldset')) ? {
          matrixchilditems_fieldset: Configuration.get('matrixchilditems.fieldset')
         } : {},
         this.searchApiMasterOptions,
         Session.getSearchApiParams()
        ),
        profile.isAvoidingDoubleRedirect()
       );

   return url;
  }

 });
});
