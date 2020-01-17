/**
 * Description : An alert icon in the header.
 * @Author : Gordon Truslove
 * @Date   : 11/18/2019, 4:46:49 PM
 */
define(
    'SafeAid.bb1.HeaderAlerts.View', [
        'SC.Configuration', 'jQuery', 'Backbone', 'Backbone.CompositeView', 'underscore', 'Utils', 'bb1_headeralerts.tpl', 'Mi365Overview'
    ],
    function (
        Configuration, jQuery, Backbone, BackboneCompositeView, _, Utils, bb1_headeralerts_tpl, Mi365Overview
    ) {
        'use strict';

        return Backbone.View.extend({

            template: bb1_headeralerts_tpl,
            initialize: function (options) {
                this.application = options.application;
                this.overview = Mi365Overview.get();
                var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});
            },
            events: {},
            childViews: {},
            getContext: function getContext() {
                //console.log(this.overview);
                var count=this.overview.get("alerts") || 0;
                var show=this.overview.get("level")!="bronze";
                return {
                    alerts: count,
                    hasAlerts:count>0,
                    show:show
                };
            }

        });

    });