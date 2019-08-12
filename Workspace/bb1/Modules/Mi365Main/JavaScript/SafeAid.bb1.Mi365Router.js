/*BB1 G Truslove 2017*/
define('SafeAid.bb1.Mi365Router', [
    'Backbone', 'SafeAid.bb1.Mi365Dashboard.View', 'SafeAid.bb1.Mi365Buyers.View', 'SafeAid.bb1.Mi365Areas.View', 'SafeAid.bb1.Mi365Wearers.View', 'SafeAid.bb1.Mi365Alerts.View','SafeAid.bb1.Mi365Buyers.Collection'
], function (Backbone, Mi365DashboardView, Mi365BuyersView, Mi365AreasView, Mi365WearersView, Mi365AlertsView,Mi365BuyersCollection) {


    return Backbone.Router.extend({
        initialize: function (application) {
            this.application = application;
        },
        routes: {
            'Mi365': 'Dashboard',
            'Mi365/buyers': 'Buyers',
            'Mi365/areas': 'Areas',
            'Mi365/wearers': 'Wearers',
            'Mi365/alerts': 'Alerts'

        },
        Dashboard: function () {
            var view = new Mi365DashboardView({
                application: this.application
            });
            view.showContent();
        },
        Buyers: function () {
            // var view = new Mi365BuyersView({
            //     application: this.application
            //   });
            // view.showContent();

            var collection = new Mi365BuyersCollection();
            var view = new Mi365BuyersView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {
                    a: 1
                }
            }).done(function () {
                view.showContent();
            });

        },
        Areas: function () {
            var view = new Mi365AreasView({
                application: this.application
            });
            view.showContent();
        },
        Wearers: function () {
            var view = new Mi365WearersView({
                application: this.application
            });
            view.showContent();
        },
        Alerts: function () {
            var view = new Mi365AlertsView({
                application: this.application
            });
            view.showContent();
        }

    });
});