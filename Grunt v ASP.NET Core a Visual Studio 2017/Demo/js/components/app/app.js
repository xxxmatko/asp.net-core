define([
    "require",
    "module",
    "jquery",
    "text!./app.html",
    "knockout"
], function (require, module, $, view, ko) {
    var global = (function () { return this; })();
    var cnf = module.config() || {};
    var $this = null;

    // Konstruktor
    var Model = function (args, info) {
        console.log("App : ctor()");

        $this = this;
    };

    // Dispose
    Model.prototype.dispose = function () {
        console.log("App : dispose()");
    };

    // Vytvorenie modelu
    Model.createViewModel = function (params, componentInfo) {
        global.app = new Model($.extend({}, cnf, params), componentInfo);

        $.each(cnf.components || {}, ko.components.register);

        return global.app;
    };

    return {
        viewModel: { createViewModel: Model.createViewModel },
        template: view
    };
});