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
      <a {{objectToAtrributes item}} data-touchpoint="home" data-hashtag="#{{href}}">
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
   <p>&copy; 2021 Safeaid Limited. All Rights Reserved.<br>
   Phone: <a href="tel: 004423 9225 4442">+44 (0)23 9225 4442</a> Email: <a href="mailto:sales@safeaid.co.uk">sales@safeaid.co.uk</a>
   </p>
  </div>
  <div class="footer-content-bottom-right">
   <p>Accepted payment methods</p>
   <p><img src="{{getExtensionAssetsPath 'img/safeaid-footer-payment.png'}}" alt="" /></p>
   <p>Safeaid Limited Signal House, 16 Arnside Road, Waterlooville, PO7 7UP, United Kingdom <br>Company Registration Number 08414761 VAT no. 226 8099 85</p>
  </div>
 </div>
 
</div>