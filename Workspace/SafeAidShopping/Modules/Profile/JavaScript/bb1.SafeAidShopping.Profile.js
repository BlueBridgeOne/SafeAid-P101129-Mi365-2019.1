//@module bb1.SafeAidShopping.Profile
define(
 'bb1.SafeAidShopping.Profile',
 [
  'bb1.SafeAidShopping.MyCatalogue.Collection',
  'Profile.Model',
  'Header.Profile.View',
  'Session',
  'SC.Configuration',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  MyCatalogueCollection,
  ProfileModel,
  HeaderProfileView,
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
//Forcing users to show as not logged in.
 _.extend(HeaderProfileView.prototype, {

    getContext: _.wrap(HeaderProfileView.prototype.getContext, function (getContext, options) {
        var profile = ProfileModel.getInstance()
			,	is_loading = !_.getPathFromObject(Configuration, 'performance.waitForUserProfile', true) && ProfileModel.getPromise().state() !== 'resolved'
			,	is_logged_in = profile.get('isLoggedIn') === 'T'&&parseInt(profile.get('internalid')) >0;
//console.log(profile);
			// @class Header.Profile.View.Context
			return {
				// @property {Boolean} showExtendedMenu
				showExtendedMenu: !is_loading && is_logged_in
				// @property {Boolean} showLoginMenu
			,	showLoginMenu: !is_loading && !is_logged_in
				// @property {Boolean} showLoadingMenu
			,	showLoadingMenu: is_loading
				// @property {Boolean} showMyAccountMenu
			,	showMyAccountMenu: !!this.options.showMyAccountMenu
				// @property {String} displayName
			,	displayName: profile.get('firstname') || profile.get('companyname')
				// @property {Boolean} showLogin
			,	showLogin: Configuration.getRegistrationType() !== 'disabled'
				// @property {Boolean} showRegister
			,	showRegister: Configuration.getRegistrationType() === 'optional' || Configuration.getRegistrationType() === 'required'
			};
    })
});
 
 return {

  mountToApp: function (container)
  {


   
  }

 };
 
});