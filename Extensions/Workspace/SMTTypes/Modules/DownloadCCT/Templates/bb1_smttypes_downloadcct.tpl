<div class="cct-download">
  <div>
        {{#if custrecord_bb1_download_image_url}}
        <img src="{{resizeImage custrecord_bb1_download_image_url 'thumbnail'}}" />
        {{/if}}
      </div>
      <div>
        <p>{{{custrecord_bb1_download_description}}}</p>
        {{#if custrecord_bb1_download_file_url}}
        <br />
        <p><a data-navigation="ignore-click" href="{{custrecord_bb1_download_file_url}}" target="_new"
            class="button-secondary button-medium">Download</a></p>
        {{/if}}
        {{#if custrecord_bb1_download_link}}
        <br />
        <p><a data-navigation="ignore-click" href="{{custrecord_bb1_download_link}}" target="_new" class="button-secondary button-medium">View</a></p>
        {{/if}}
      </div>
</div>


<!--
  Available helpers:
  {{ getExtensionAssetsPath "img/image.jpg"}} - reference assets in your extension
  
  {{ getExtensionAssetsPathWithDefault context_var "img/image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the extension assets folder
  
  {{ getThemeAssetsPath context_var "img/image.jpg"}} - reference assets in the active theme
  
  {{ getThemeAssetsPathWithDefault context_var "img/theme-image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the theme assets folder
-->