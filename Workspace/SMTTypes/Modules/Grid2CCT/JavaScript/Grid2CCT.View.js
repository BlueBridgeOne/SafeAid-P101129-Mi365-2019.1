// bb1.SMTTypes.GridCCTView, this is the view your cct
// will load after dragged into the application

define('bb1.SMTTypes.Grid2CCT.View', [
	'CustomContentType.Base.View'

	, 'bb1_smttypes_grid2cct.tpl'

	, 'jQuery', 'underscore'
], function (
	CustomContentTypeBaseView

	, bb1_smttypes_grid2cct_tpl

	, jQuery, _
) {
	'use strict';

	return CustomContentTypeBaseView.extend({

		template: bb1_smttypes_grid2cct_tpl,
		getContext: function getContext() {
			
			switch (this.settings.custrecord_bb1_grid2_cct_align) {

				case "2": //Horizontal 33% / 67%
					this.settings.grow1 = 33;
					this.settings.grow2 = 67;
					break;
				case "3": //Horizontal 67% / 33%
					this.settings.grow1 = 67;
					this.settings.grow2 = 33;
					break;
				case "4": //Horizontal 25% / 75%
					this.settings.grow1 = 25;
					this.settings.grow2 = 75;
					break;
				case "5": //Horizontal 75% / 25%
					this.settings.grow1 = 75;
					this.settings.grow2 = 25;
					break;
				default: //Horizontal 50% / 50%
					this.settings.grow1 = 50;
					this.settings.grow2 = 50;
					break;
			}
			//flex-grow
			this.settings.showImage1 = this.settings.custrecord_bb1_grid2_cct_image1_url && this.settings.custrecord_bb1_grid2_cct_image1_url.length > 0;
			this.settings.showImage2 = this.settings.custrecord_bb1_grid2_cct_image2_url && this.settings.custrecord_bb1_grid2_cct_image2_url.length > 0;

			return this.settings;
		}
	});
});