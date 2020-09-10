/**
 * Description : A static copy of the overview information, with a promise.
 * @Author : Gordon Truslove
 * @Date   : 11/18/2019, 2:00:51 PM
 */
define(
    'Mi365Overview', [
        'SC.Configuration', 'jQuery', 'SafeAid.bb1.Mi365Overview.Model'
    ],
    function (
        Configuration, jQuery, Mi365OverviewModel
    ) {
        'use strict';

        function _getData() {
            var data = window["overview"];
            if (!window["overview"]) {
                data = {
                    loaded: false,
                    model: new Mi365OverviewModel(),
                    callbacks: []
                };
                window["overview"] = data;

                data.model.fetch({
                    data: {
                        t: new Date().getTime(),
                        muteerrors: true
                    }
                }).done(function () {
                    data.loaded = true;
                    for (var i = 0; i < data.callbacks.length; i++) {
                        data.callbacks[i](data.model);
                    }
                });
            }
            return data;
        }

        return {
            get: function (value) {
                return _getData().model;
            },
            loaded: function () {
                return _getData().loaded;
            },
            done: function (func) {
                if (!_getData().loaded) {
                    _getData().callbacks.push(func);
                }
            }
        };

    });