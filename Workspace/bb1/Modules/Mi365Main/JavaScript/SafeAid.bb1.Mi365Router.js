/*BB1 G Truslove 2017*/
define('SafeAid.bb1.Mi365Router', [
    'Backbone', 'SafeAid.bb1.Mi365Dashboard.View', 'SafeAid.bb1.Mi365Buyers.View','SafeAid.bb1.Mi365Buyer.View', 'SafeAid.bb1.Mi365Areas.View', 'SafeAid.bb1.Mi365Area.View', 'SafeAid.bb1.Mi365Wearers.View', 'SafeAid.bb1.Mi365Alerts.View','SafeAid.bb1.Mi365Buyers.Collection','SafeAid.bb1.Mi365Buyers.Model','SafeAid.bb1.Mi365Areas.Collection','SafeAid.bb1.Mi365Areas.Model'
], function (Backbone, Mi365DashboardView, Mi365BuyersView,Mi365BuyerView, Mi365AreasView,Mi365AreaView, Mi365WearersView, Mi365AlertsView,Mi365BuyersCollection,Mi365BuyersModel,Mi365AreasCollection,Mi365AreasModel) {


    return Backbone.Router.extend({
        initialize: function (application) {
            this.application = application;
        },
        routes: {
            'Mi365': 'Dashboard',
            'Mi365/buyers': 'Buyers',
            'Mi365/areas': 'Areas',
            'Mi365/wearers': 'Wearers',
            'Mi365/alerts': 'Alerts',
            'Mi365/buyer/:id': 'Buyer',
            'Mi365/area/:id': 'Area'

        },
        Dashboard: function () {
            var view = new Mi365DashboardView({
                application: this.application
            });
            view.showContent();
        },
        Buyer: function (id) {
            var model = new Mi365BuyersModel();
            var view = new Mi365BuyerView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {id:id}
            }).done(function () {
                view.showContent();
            });
        },
        Buyers: function () {
            var collection = new Mi365BuyersCollection();
            var view = new Mi365BuyersView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {}
            }).done(function () {
                view.showContent();
            });
        },
        Area: function (id) {
            var model = new Mi365AreasModel();
            var view = new Mi365AreaView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {id:id}
            }).done(function () {
                view.showContent();
            });
        },Areas: function () {
            var collection = new Mi365AreasCollection();
            var view = new Mi365AreasView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {}
            }).done(function () {
                view.showContent();
            });
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