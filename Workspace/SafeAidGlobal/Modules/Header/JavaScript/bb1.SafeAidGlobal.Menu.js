//@module bb1.SafeAidGlobal.Menu
define(
 'bb1.SafeAidGlobal.Menu',
 [
  'Profile.Model',
  'SC.Configuration',
  'underscore',
  'Utils'
 ],
 function (
  ProfileModel,
  Configuration,
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
    //     console.log(profile);
    // console.log(customerShowStandardItems+" "+contactOverrideCustomerItems+" "+contactShowStandardItems);
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
   
  }

 };
 
});