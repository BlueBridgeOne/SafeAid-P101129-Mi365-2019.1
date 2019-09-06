// bb1.SMTTypes.GridCCTView, this is the view your cct
// will load after dragged into the application

define('bb1.SMTTypes.Grid3CCT.View'
,	[
		'CustomContentType.Base.View'

	,	'bb1_smttypes_grid3cct.tpl'

	,	'jQuery'
	,	'underscore'
	]
,	function (
		CustomContentTypeBaseView

	,	bb1_smttypes_grid3cct_tpl

	,	jQuery
	,	_
	)
{
	'use strict';

	return CustomContentTypeBaseView.extend({

		template: bb1_smttypes_grid3cct_tpl
	,	getContext: function getContext()
		{
			console.log(this.settings);
			this.settings.medium1 = " grow25";
					this.settings.medium2 = " grow25";
					this.settings.medium3 = " grow25";
					
			switch (this.settings.custrecord_bb1_grid3_cct_align) {

				case "2": 
					this.settings.grow1 = 50;
					this.settings.grow2 = 25;
					this.settings.grow3 = 25;

					this.settings.medium1 = " grow50";
					break;
				case "3":
					this.settings.grow1 = 25;
					this.settings.grow2 = 50;
					this.settings.grow3 = 25;

					this.settings.medium2 = " grow50";
					break;
				case "4": 
					this.settings.grow1 = 25;
					this.settings.grow2 = 25;
					this.settings.grow3 = 50;
					
					this.settings.medium3 = " grow50";
					break;
				default:
					this.settings.grow1 = 33;
					this.settings.grow2 = 33;
					this.settings.grow3 = 33;

					this.settings.medium1 = " grow33";
					this.settings.medium2 = " grow33";
					this.settings.medium3 = " grow33";
					break;
			}

			this.settings.showImage1=this.settings.custrecord_bb1_grid3_cct_image1_url&&this.settings.custrecord_bb1_grid3_cct_image1_url.length>0;
			this.settings.showImage2=this.settings.custrecord_bb1_grid3_cct_image2_url&&this.settings.custrecord_bb1_grid3_cct_image2_url.length>0;
			this.settings.showImage3=this.settings.custrecord_bb1_grid3_cct_image3_url&&this.settings.custrecord_bb1_grid3_cct_image3_url.length>0;
			
			return this.settings;
		}
	});
});