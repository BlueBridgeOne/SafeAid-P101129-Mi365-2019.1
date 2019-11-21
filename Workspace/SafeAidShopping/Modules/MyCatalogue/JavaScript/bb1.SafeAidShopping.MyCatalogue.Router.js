//@module bb1.SafeAidShopping.MyCatalogue
define(
 'bb1.SafeAidShopping.MyCatalogue.Router',
 [
  'bb1.SafeAidShopping.MyCatalogue.List.View',
  'bb1.SafeAidShopping.MyCatalogue.Collection',
  'Backbone',
  'Utils'
 ],
 function (
  MyCatalogueListView,
  MyCatalogueCollection,
  Backbone,
  Utils
 )
{
 'use strict';

 return Backbone.Router.extend({

  routes: {
   'my-catalogue': 'myCatalogue',
   'my-catalogue?:options': 'myCatalogue'
  },

  initialize: function (application)
  {
   this.application = application;
  },

  myCatalogue: function (options)
  {
   if (options)
   {
    options = Utils.parseUrlOptions(options);
   }
   else
   {
    options = {page: 1};
   }

   var collection = new MyCatalogueCollection(),
    view = new MyCatalogueListView({
     application: this.application,
     sort: options.sort || 0,
     page: options.page || 1,
     model: collection
    });

   view.model.on('reset', view.render, view);
   view.showContent();
  }
  
 });
 
});