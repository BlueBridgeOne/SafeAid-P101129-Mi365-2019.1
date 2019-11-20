//@module bb1.SafeAidShopping.Main
define(
 'bb1.SafeAidShopping.Main',
 [
  'bb1.SafeAidShopping.Profile',
  'bb1.SafeAidShopping.Cart',
  'bb1.SafeAidShopping.ProductDetails',
  'bb1.SafeAidShopping.MyCatalogue',
  'bb1.SafeAidShopping.Footer'
 ],
 function
 (
  Profile,
  Cart,
  ProductDetails,
  MyCatalogue,
  Footer
 )
 {
  'use strict';
  
  var Modules = arguments;
  
  return {
   
   mountToApp: function(container) {
    
    for (i in Modules) {
     var module = Modules[i];
     if (module && module.mountToApp)
      module.mountToApp(container);
    }
    
   }
   
  };
  
 }
);