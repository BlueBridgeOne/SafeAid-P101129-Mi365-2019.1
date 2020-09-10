<ul class="global-views-breadcrumb" itemprop="breadcrumb">
	{{#each pages}}
		{{#if @last}}
			<li class="global-views-breadcrumb-item-active">
				{{text}}
			</li>
		{{else}}
			<li class="global-views-breadcrumb-item">
				<a href="{{href}}" 
					{{#if hasDataTouchpoint}} data-touchpoint="{{data-touchpoint}}" {{/if}}
					{{#if hasDataHashtag}} data-hashtag="{{data-hashtag}}" {{/if}}
				> {{text}} </a>
			</li>
			<li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
		{{/if}}
	{{/each}}
</ul>



{{!----
Use the following context variables when customizing this template: 
	
	pages (Array)

----}}
