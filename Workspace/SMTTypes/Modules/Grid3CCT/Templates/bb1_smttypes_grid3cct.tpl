<div class="grid" style="background-color:{{custrecord_bb1_grid3_cct_bgbannercolour}};">
  <div class="grid-inner">
    <div class="grid3-flex">
      <div class="{{medium1}}"
        style="width:{{grow1}}%;background-color:{{custrecord_bb1_grid3_cct_bgcolour1}};color:{{custrecord_bb1_grid3_cct_fgcolour1}};">
        {{#if showImage1}}
        <img src="{{resizeImage custrecord_bb1_grid3_cct_image1_url 'main'}}" />
        {{else}}
        <div class="grid3-cell">
          {{{custrecord_bb1_grid3_cct_content1}}}
        </div>
        {{/if}}
      </div>
      <div class="{{medium2}}"
        style="width:{{grow2}}%;background-color:{{custrecord_bb1_grid3_cct_bgcolour2}};color:{{custrecord_bb1_grid3_cct_fgcolour2}};">
        {{#if showImage2}}
        <img src="{{resizeImage custrecord_bb1_grid3_cct_image2_url 'main'}}" />
        {{else}}
        <div class="grid3-cell">
          {{{custrecord_bb1_grid3_cct_content2}}}
        </div>
        {{/if}}
      </div>
      <div class="{{medium3}}"
        style="width:{{grow3}}%;background-color:{{custrecord_bb1_grid3_cct_bgcolour3}};color:{{custrecord_bb1_grid3_cct_fgcolour3}};">
        {{#if showImage3}}
        <img src="{{resizeImage custrecord_bb1_grid3_cct_image3_url 'main'}}" />
        {{else}}
        <div class="grid3-cell">
          {{{custrecord_bb1_grid3_cct_content3}}}
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