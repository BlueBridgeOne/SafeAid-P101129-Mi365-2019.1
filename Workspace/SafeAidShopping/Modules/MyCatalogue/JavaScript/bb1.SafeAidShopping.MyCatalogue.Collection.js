//@module bb1.SafeAidShopping.MyCatalogue
define(
 'bb1.SafeAidShopping.MyCatalogue.Collection',
 [
  'bb1.SafeAidShopping.MyCatalogue.Model',
  'Item.Collection',
  'Profile.Model',
  'Session',
  'SC.Configuration',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  MyCatalogueModel,
  ItemCollection,
  ProfileModel,
  Session,
  Configuration,
  
  Backbone,
  _,
  Utils
 )
{
 'use strict';

 return ItemCollection.extend({

  customersFacetId: 'custitem_bb1_sca_customers',
  
  buyersFacetId: 'custitem_bb1_sca_buyers',
  
  pageSize: 10,

  url: function()
  {
   var profile = ProfileModel.getInstance(),
       sessionSearchApiParams = Session.getSearchApiParams();
   
   delete sessionSearchApiParams[this.customersFacetId];
   delete sessionSearchApiParams[this.buyersFacetId];
   
   var url = _.addParamsToUrl(
    profile.getSearchApiUrl(),
    _.extend(
     (Configuration.get('matrixchilditems.enabled') && Configuration.get('matrixchilditems.fieldset')) ? {
       matrixchilditems_fieldset: Configuration.get('matrixchilditems.fieldset')
      } : {},
     this.searchApiMasterOptions,
     sessionSearchApiParams
    ),
    profile.isAvoidingDoubleRedirect()
   );

   return url;
  },
  
  model: MyCatalogueModel,

  parse: function (response)
  {
   this.totalRecordsFound = response.total;
   this.recordsPerPage = this.pageSize;
   
   return response.items;
  },

  update: function (options, list_header)
  {
   var self = this,
       sortOrder,
       profile = ProfileModel.getInstance(),
       contactIsBuyer = profile.get('contactIsBuyer');
   
   if (!contactIsBuyer) {
    this.trigger('reset');
    return;
   }
   
   switch (options.sort.value) {
    case 'price':
     sortOrder = 'onlinecustomerprice';
     break;
    case 'name':
     sortOrder = 'storedisplayname';
     break;
   }
   
   var dataFilters = {
    fieldset: 'search',
    sort: sortOrder + (options.order > 0 ? ':asc' : ':desc'),
    limit: this.pageSize,
    offset: this.pageSize * (parseInt(options.page || 1, 10) - 1)
   };

   var contactOverrideCustomerItems = profile.get('contactOverrideCustomerItems');
   
   if (contactOverrideCustomerItems) {
    dataFilters[this.buyersFacetId] = profile.get('contactFacetValueUrl') || 'XXXXXXXXXXXXXXXX';
   }
   else {
    dataFilters[this.customersFacetId] = profile.get('customersFacetValueUrl') || 'XXXXXXXXXXXXXXXX';
   }
   
   this.fetch({
    data: dataFilters,
    reset: true,
    killerId: options.killerId
   });
  }
  
 });
});