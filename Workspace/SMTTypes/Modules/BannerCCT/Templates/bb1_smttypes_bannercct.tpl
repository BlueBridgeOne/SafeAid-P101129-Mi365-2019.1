<div class="cct-banner">
  <div class="cct-banner-inner"
    style="background-color:{{custrecord_bb1_banner_cct_bgcolour}};color:{{custrecord_bb1_banner_cct_fgcolour}};{{#if custrecord_bb1_banner_cct_bgimage_url}}background-image:url('{{custrecord_bb1_banner_cct_bgimage_url}}');{{/if}}">
    <div class="cct-banner-inner-container">
      <h1>{{custrecord_bb1_banner_cct_title}}</h1>
    </div>
  </div>
</div>


<!--
  Available helpers:
  {{ getExtensionAssetsPath "img/image.jpg"}} - reference assets in your extension
  
  {{ getExtensionAssetsPathWithDefault context_var "img/image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the extension assets folder
  
  {{ getThemeAssetsPath context_var "img/image.jpg"}} - reference assets in the active theme
  
  {{ getThemeAssetsPathWithDefault context_var "img/theme-image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the theme assets folder
-->