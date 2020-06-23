"use strict";
var DataTable = /** @class */ (function () {
    function DataTable(selector) {
        this._selector = selector;
        this._columns = [];
        this._items = [];
    }
    DataTable.prototype.create = function () {
        var _this = this;
        var _a;
        var el = document.querySelector(this._selector);
        if ((el === null || el === void 0 ? void 0 : el.tagName.toLowerCase()) != 'table')
            throw new Error('Table is required');
        var headers = [].slice.call((_a = el.querySelector('thead tr')) === null || _a === void 0 ? void 0 : _a.children);
        headers.forEach(function (element) {
            _this._columns.push(element.textContent);
        });
        console.log(this._columns);
    };
    return DataTable;
}());
