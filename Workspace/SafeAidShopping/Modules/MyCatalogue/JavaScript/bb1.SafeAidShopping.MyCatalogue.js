//@module bb1.SafeAidShopping.MyCatalogue
define(
 'bb1.SafeAidShopping.MyCatalogue',
 [
  'Profile.Model',
  'SC.Configuration',
  'bb1.SafeAidShopping.MyCatalogue.Router',
  'bb1.SafeAidShopping.MyCatalogue.List.View',
  'underscore',
  'Utils'
 ],
 function (
  ProfileModel,
  Configuration,
  MyCatalogueRouter,
  MyCatalogueListView,
  _,
  Utils
 )
{
 'use strict';

 return {

  mountToApp: function (container)
  {
   var layout = container.getComponent('Layout'),
       profile = ProfileModel.getInstance(),
       contactIsBuyer = profile.get('contactIsBuyer');
   
   if (contactIsBuyer) {
     
    var customerShowStandardItems = profile.get('customerShowStandardItems'),
        contactOverrideCustomerItems = profile.get('contactOverrideCustomerItems'),
        contactShowStandardItems = profile.get('contactShowStandardItems');
    
    if (!customerShowStandardItems || (contactOverrideCustomerItems && !contactShowStandardItems)) {
     var allowedMenuItems = ['Home', 'Information'];
     
     Configuration.navigationData = _.filter(Configuration.navigationData, function(menuItem) {
      return allowedMenuItems.indexOf(menuItem.text) != -1;
     });
    }
    
    Configuration.navigationData.push({
     id: '',
     parentId: '',
     text: 'My Catalogue',
     href: '/',
     dataHashtag: '#/my-catalogue',
     dataTouchpoint: 'home',
     'data-hashtag': '#/my-catalogue',
     'data-touchpoint': 'home',
     class: 'header-menu-level1-anchor header-menu-mycatalogue-anchor',
     classnames: 'header-menu-mycatalogue-anchor',
     level: '1',
     placeholder: ''
    });
    
   }
   
   if (layout) {
    var pageType = layout.application.getComponent('PageType');
     pageType.registerPageType({
      'name': 'MyCatalogue',
      'routes': [
       'my-catalogue',
       'my-catalogue?:options'
      ],
      'view': MyCatalogueListView,
      'defaultTemplate': {
       'name': 'safeaid_bb1_mycatalogue.tpl',
       'displayName': 'My Catalogue',
       'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
      }
     });
    };
   }

 };
 
});