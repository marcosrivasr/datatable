"use strict";
var Pagination = /** @class */ (function () {
    function Pagination() {
        this._pagination = { total: 0, noItemsPerPage: 0, noPages: 0, actual: 0, pointer: 0, diff: 0, lastPageBeforeDots: 0, noButtonsBeforeDots: 4 };
    }
    Pagination.prototype.initPagination = function (nItems, nEntries) {
        this._pagination.total = nItems;
        this._pagination.noItemsPerPage = nEntries;
        this._pagination.noPages = Math.ceil(this._pagination.total / this._pagination.noItemsPerPage);
        this._pagination.actual = 1;
        this._pagination.pointer = 0;
        this._pagination.diff = this._pagination.noItemsPerPage - (this._pagination.total % this._pagination.noItemsPerPage);
    };
    Pagination.prototype.getIteratedButtons = function (start, end) {
        var res = '';
        for (var i = start; i <= end; i++) {
            if (i === this._pagination.actual) {
                res += "<li><span class=\"active\">" + i + "</span></li>";
            }
            else {
                res += "<li><button data-page=\"" + i + "\">" + i + "</button></li>";
            }
        }
        return res;
    };
    Object.defineProperty(Pagination.prototype, "limit", {
        get: function () {
            return this._pagination.actual * this._pagination.noItemsPerPage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "total", {
        get: function () {
            return this._pagination.total;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "pointer", {
        get: function () {
            return this._pagination.pointer;
        },
        set: function (value) {
            this._pagination.pointer = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "actual", {
        get: function () {
            return this._pagination.actual;
        },
        set: function (value) {
            this._pagination.actual = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "noPages", {
        get: function () {
            return this._pagination.noPages;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "noButtonsBeforeDots", {
        get: function () {
            return this._pagination.noButtonsBeforeDots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "noItemsPerPage", {
        get: function () {
            return this._pagination.noItemsPerPage;
        },
        enumerable: false,
        configurable: true
    });
    return Pagination;
}());
