
<div class="aspect-ratio">
  <iframe width="{{custrecord_bb1_youtube_cct_width}}" height="{{custrecord_bb1_youtube_cct_height}}" src="https://www.youtube.com/embed/{{custrecord_bb1_youtube_cct_videoid}}?autoplay={{#if custrecord_bb1_youtube_cct_autoplay}}1{{else}}0{{/if}}&rel=0&modestbranding=1" frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
</div>


<!--
  Available helpers:
  {{ getExtensionAssetsPath "img/image.jpg"}} - reference assets in your extension
  
  {{ getExtensionAssetsPathWithDefault context_var "img/image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the extension assets folder
  
  {{ getThemeAssetsPath context_var "img/image.jpg"}} - reference assets in the active theme
  
  {{ getThemeAssetsPathWithDefault context_var "img/theme-image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the theme assets folder
-->