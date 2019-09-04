// bb1.SMTTypes.GridCCTView, this is the view your cct
// will load after dragged into the application

define('bb1.SMTTypes.Grid2CCT.View'
,	[
		'CustomContentType.Base.View'

	,	'bb1_smttypes_grid2cct.tpl'

	,	'jQuery'
	,	'underscore'
	]
,	function (
		CustomContentTypeBaseView

	,	bb1_smttypes_grid2cct_tpl

	,	jQuery
	,	_
	)
{
	'use strict';

	return CustomContentTypeBaseView.extend({

		template: bb1_smttypes_grid2cct_tpl
	,	getContext: function getContext()
		{
			console.log(this.settings);
			try{
			this.settings.showImage1=this.settings.custrecord_bb1_grid2_cct_image1_url&&this.settings.custrecord_bb1_grid2_cct_image1_url.length>0;
			this.settings.showImage2=this.settings.custrecord_bb1_grid2_cct_image2_url&&this.settings.custrecord_bb1_grid2_cct_image2_url.length>0;
			}catch(err){
			console.log(err);
			}
			return this.settings;
		}
	});
});