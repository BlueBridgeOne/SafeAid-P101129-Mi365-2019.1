<div data-view="Global.BackToTop"></div>
<div class="footer-content">

 <div id="banner-footer" class="content-banner banner-footer" data-cms-area="global_banner_footer" data-cms-area-filters="global"></div>

 <div class="footer-content-nav">
  {{#if showFooterNavigationLinks}}
   <ul class="footer-content-nav-list">
    {{#each footerNavigationLinks}}
     {{#if columnBreak}}
   </ul>
   <ul class="footer-content-nav-list">
     {{/if}}
     <li{{#if classes}} class="{{classes}}"{{/if}}>
      {{#if href}}
      <a {{objectToAtrributes item}}>
       {{text}}
      </a>
      {{else}}
       {{text}}
      {{/if}}
     </li>
    {{/each}}
   </ul>
  {{/if}}
 </div>

 <div class="footer-content-bottom">
  <div class="footer-content-bottom-left">
   <p>
    <a href="http://uk.linkedin.com/company/safeaid-llp" target="_blank">
     <img src="{{getExtensionAssetsPath 'img/safeaid-footer-copyright.png'}}" alt="" />
    </a>
   </p>
   <p>
    <img src="{{getExtensionAssetsPath 'img/safeaid-footer-bsif.png'}}" alt="" />
    <img src="{{getExtensionAssetsPath 'img/safeaid-footer-risqs.gif'}}" class="footer-content-risqs-logo" alt="" />
   </p>
   <p>&copy; 2020 Safeaid LLP. All Rights Reserved.<br></p>
  </div>
  <div class="footer-content-bottom-right">
   <p>Accepted payment methods</p>
   <p><img src="{{getExtensionAssetsPath 'img/safeaid-footer-payment.png'}}" alt="" /></p>
   <p>Safeaid LLP Signal House, 16 Arnside Road, Waterlooville, Hampshire, PO7 7UP <br>Company Registration Number OC382751 VAT no. 161 5765 02</p>
  </div>
 </div>
 
</div>