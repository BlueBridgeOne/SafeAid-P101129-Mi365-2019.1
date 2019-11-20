//@module bb1.SafeAidShopping.Footer
define(
 'bb1.SafeAidShopping.Footer',
 [
  'Footer.View',
  
  'bb1_safeaidshopping_footer.tpl',
  
  'underscore'
 ],
 function (
  FooterView,
  
  bb1_safeaidshopping_footer_tpl,
  
  _
 )
 {
  'use strict';
  
  FooterView.prototype.template = bb1_safeaidshopping_footer_tpl;
 
});