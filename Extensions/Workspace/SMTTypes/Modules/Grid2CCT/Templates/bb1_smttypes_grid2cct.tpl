<div class="grid" style="background-color:{{custrecord_bb1_grid2_cct_bgbannercolour}};">
  <div class="grid-inner">
<div class="grid2-flex">
  <div class="cms-padding"
    style="width:{{grow1}}%;background-color:{{custrecord_bb1_grid2_cct_bgcolour1}};color:{{custrecord_bb1_grid2_cct_fgcolour1}};">
    {{#if showImage1}}
    {{#ifEquals custrecord_bb1_grid2_cct_showchevrons 'T'}}
    <img class="grid-chevron-left" src="{{getExtensionAssetsPath "img/cct_bb1_chevrons.svg"}}" />
    {{/ifEquals}}
    <img src="{{resizeImage custrecord_bb1_grid2_cct_image1_url 'main'}}" />
    {{else}}
    <div class="grid2-cell">
    {{{custrecord_bb1_grid2_cct_content1}}}
    </div>
    {{/if}}
  </div>
  <div class="cms-padding"
    style="width:{{grow2}}%;background-color:{{custrecord_bb1_grid2_cct_bgcolour2}};color:{{custrecord_bb1_grid2_cct_fgcolour2}};">
    {{#if showImage2}}
    {{#ifEquals custrecord_bb1_grid2_cct_showchevrons 'T'}}
    <img class="grid-chevron-right" src="{{getExtensionAssetsPath "img/cct_bb1_chevrons.svg"}}" />
    {{/ifEquals}}
    <img src="{{resizeImage custrecord_bb1_grid2_cct_image2_url 'main'}}" />
    {{else}}
    <div class="grid2-cell">
    {{{custrecord_bb1_grid2_cct_content2}}}
    </div>
    {{/if}}
  </div>
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