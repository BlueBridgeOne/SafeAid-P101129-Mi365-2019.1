// @module bb1.SMTTypes.YouTubeCCT

// An example cct that shows a message with the price, using the context data from the item

// Use: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/service.ss')) 
// to reference services or images available in your extension assets folder

define(
	'bb1.SMTTypes.YouTubeCCT'
,   [
		'bb1.SMTTypes.YouTubeCCT.View',
		'bb1.SMTTypes.BannerCCT.View',
		'bb1.SMTTypes.Grid2CCT.View',
		'bb1.SMTTypes.Grid3CCT.View'
	]
,   function (
		YouTubeCCTView,
		BannerCCTView,
		Grid2CCTView,
		Grid3CCTView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			var CMS=container.getComponent('CMS');
			CMS.registerCustomContentType({
				
				// this property value MUST be lowercase
				id: 'cct_bb1_youtube'
				
				// The view to render the CCT
			,	view: YouTubeCCTView
			});

			CMS.registerCustomContentType({
				
				// this property value MUST be lowercase
				id: 'cct_bb1_banner2'
				
				// The view to render the CCT
			,	view: BannerCCTView
			});

			CMS.registerCustomContentType({
				
				// this property value MUST be lowercase
				id: 'cct_bb1_grid2'
				
				// The view to render the CCT
			,	view: Grid2CCTView
			});
			
			CMS.registerCustomContentType({
				
				// this property value MUST be lowercase
				id: 'cct_bb1_grid3'
				
				// The view to render the CCT
			,	view: Grid3CCTView
			});
		}
	};
});