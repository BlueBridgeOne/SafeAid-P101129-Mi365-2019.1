/*BB1 G Truslove 2017*/
define('SafeAid.bb1.Mi365Router', [
    'Backbone',
    'SafeAid.bb1.Mi365Dashboard.View',
    'SafeAid.bb1.Mi365Buyers.View',
    'SafeAid.bb1.Mi365Buyer.View',
    'SafeAid.bb1.Mi365Areas.View',
    'SafeAid.bb1.Mi365Area.View',
    'SafeAid.bb1.Mi365Wearers.View',
    'SafeAid.bb1.Mi365Wearer.View',
    'SafeAid.bb1.Mi365Alerts.View',
    'SafeAid.bb1.Mi365Alert.View',
    'SafeAid.bb1.Mi365Stocks.View',
    'SafeAid.bb1.Mi365Stock.View',
    'SafeAid.bb1.Mi365Buyers.Collection',
    'SafeAid.bb1.Mi365Buyers.Model',
    'SafeAid.bb1.Mi365Areas.Collection',
    'SafeAid.bb1.Mi365Areas.Model',
    'SafeAid.bb1.Mi365Wearers.Collection',
    'SafeAid.bb1.Mi365Wearers.Model',
    'SafeAid.bb1.Mi365Alerts.Collection',
    'SafeAid.bb1.Mi365Alerts.Model',
    'SafeAid.bb1.Mi365Stocks.Collection',
    'SafeAid.bb1.Mi365Stocks.Model'
], function (
    Backbone,
    Mi365DashboardView,
    Mi365BuyersView,
    Mi365BuyerView,
    Mi365AreasView,
    Mi365AreaView,
    Mi365WearersView,
    Mi365WearerView,
    Mi365AlertsView,
    Mi365AlertView,
    Mi365StocksView,
    Mi365StockView,
    Mi365BuyersCollection,
    Mi365BuyersModel,
    Mi365AreasCollection,
    Mi365AreasModel,
    Mi365WearersCollection,
    Mi365WearersModel,
    Mi365AlertsCollection,
    Mi365AlertsModel,
    Mi365StocksCollection,
    Mi365StocksModel) {


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
            'Mi365/area/:id': 'Area',
            'Mi365/wearer/:id': 'Wearer',
            'Mi365/alert/:id': 'Alert',
            'Mi365/wearer/stock/:id': 'WearerStocks',
            'Mi365/area/stock/:id': 'AreaStocks',
            'Mi365/stock/:id': 'Stock'

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
                data: {
                    id: id,
					t: new Date().getTime()
                }
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
                data: {
                    id: id,
					t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Areas: function () {
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
        Wearer: function (id) {
            var model = new Mi365WearersModel();
            var view = new Mi365WearerView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
					t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Wearers: function () {
            var collection = new Mi365WearersCollection();
            var view = new Mi365WearersView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {}
            }).done(function () {
                view.showContent();
            });
        },
        Alert: function (id) {
            var model = new Mi365AlertsModel();
            var view = new Mi365AlertView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
					t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Alerts: function () {
            var collection = new Mi365AlertsCollection();
            var view = new Mi365AlertsView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {}
            }).done(function () {
                view.showContent();
            });
        },
        Stock: function (id) {
            var model = new Mi365StocksModel();
            var view = new Mi365StockView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
					t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        WearerStocks: function (id) {
            var collection = new Mi365StocksCollection();
            var view = new Mi365StocksView({
                collection: collection,
                application: this.application,
                wearer:id
            });

            collection.fetch({
                data: {wearer: id,
					t: new Date().getTime()}
            }).done(function () {
                view.showContent();
            });
        },
        AreaStocks: function (id) {
            var collection = new Mi365StocksCollection();
            var view = new Mi365StocksView({
                collection: collection,
                application: this.application,
                area:id
            });

            collection.fetch({
                data: {area: id,
					t: new Date().getTime()}
            }).done(function () {
                view.showContent();
            });
        }

    });
});