define([
    "module",
    "jquery",
    "knockout"
], function (module, $, ko) {
    // Zaregistrujeme komponenty
    ko.components.register("app", { require: "components/app/app" });
     
    // Spustime aplikaciu
    $(function () {
        ko.applyBindings({});
    });
});