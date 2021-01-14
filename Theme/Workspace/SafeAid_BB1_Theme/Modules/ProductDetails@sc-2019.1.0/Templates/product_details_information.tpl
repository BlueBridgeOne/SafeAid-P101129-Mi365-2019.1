<div class="product-details-information-content">
	{{#if showInformation}}

			<div class="product-details-information-content-container">

				<div id="banner-content-top" class="content-banner banner-content-top"></div>

				
					{{#each details}}
						<div class="product-details-information-tab-content" data-type="information-content" >
								<div class="product-details-information-tab-content-panel active" id="product-details-information-tab-{{@index}}" itemprop="{{itemprop}}" data-id="product-details-information-{{ @index }}">
									{{#if ../showHeader}}<h2 class="product-details-information-tab-content-panel-title">{{name}}</h2>{{/if}}
									<div id="product-details-information-tab-content-container-{{@index}}" class="product-details-information-tab-content-container" data-type="information-content-text">{{{content}}}</div>
								</div>
						</div>
					{{/each}}
					</div>
				
				<div id="banner-content-bottom" class="content-banner banner-content-bottom"></div>
			</div>
	{{/if}}
</div>



{{!----
Use the following context variables when customizing this template:

	showInformation (Boolean)
	showHeader (Boolean)
	details (Array)

----}}
