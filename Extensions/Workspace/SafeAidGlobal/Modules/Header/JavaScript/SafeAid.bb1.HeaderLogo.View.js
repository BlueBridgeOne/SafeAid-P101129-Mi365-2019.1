/**
 * Description : A custom logo in the header.
 * @Author : Gordon Truslove
 * @Date   : 11/18/2019, 4:46:49 PM
 */
define(
    'SafeAid.bb1.HeaderLogo.View', [
         'Backbone',  'underscore', 'bb1_headerlogo.tpl','Profile.Model'
    ],
    function (
         Backbone, _, bb1_headerlogo_tpl,ProfileModel
    ) {
        'use strict';

        return Backbone.View.extend({

            template: bb1_headerlogo_tpl,
            initialize: function (options) {
                this.application = options.application;
               
            },
            events: {},
            childViews: {},
            getContext: function getContext() {
                var profile = ProfileModel.getInstance();
                return {
                    logo_url:profile.get("custentity_bb1_sca_websitelogo_url"),
                    companyname:profile.get("companyname")
                };
            }

        });

    });