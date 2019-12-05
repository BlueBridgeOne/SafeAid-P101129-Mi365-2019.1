//@module bb1.SafeAidShopping.Profile
define(
 'bb1.SafeAidShopping.Profile',
 [
  'bb1.SafeAidShopping.MyCatalogue.Collection',
  'Profile.Model',
  'Session',
  'SC.Configuration',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  MyCatalogueCollection,
  ProfileModel,
  Session,
  Configuration,
  
  Backbone,
  _,
  Utils
 )
{
 'use strict';

 const customersFacetId = 'custitem_bb1_sca_customers';
 const buyersFacetId = 'custitem_bb1_sca_buyers';
 
 Session.getSearchApiParams = _.wrap(Session.getSearchApiParams, function (originalGetSearchApiParams)
 {
  var searchApiParams = originalGetSearchApiParams.apply(this, _.rest(arguments));
 
  var profile = ProfileModel.getInstance(),
      contactIsBuyer = profile.get('contactIsBuyer');
  
  if (contactIsBuyer) {
    
   var customerShowStandardItems = profile.get('customerShowStandardItems'),
       contactOverrideCustomerItems = profile.get('contactOverrideCustomerItems'),
       contactShowStandardItems = profile.get('contactShowStandardItems');
   
   if (contactOverrideCustomerItems && !contactShowStandardItems) {
    searchApiParams.custitem_bb1_sca_buyers = profile.get('contactFacetValueUrl') || 'XXXXXXXXXXXXXXXX';
   }
   else if (!customerShowStandardItems) {
    searchApiParams.custitem_bb1_sca_customers = profile.get('customersFacetValueUrl') || 'XXXXXXXXXXXXXXXX';
   }
   else {
    searchApiParams.custitem_bb1_sca_standarditem = 'true';
   }
  
  }
  else {
   searchApiParams.custitem_bb1_sca_standarditem = 'true';
  }
   
  return searchApiParams;
 });
 
 return {

  mountToApp: function (container)
  {
   
  }

 };
 
});