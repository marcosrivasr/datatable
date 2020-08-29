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
    Pagination.prototype.renderPagesButtons = function (container, mainContainer) {
        var _this = this;
        container.innerHTML = '';
        var pages = '';
        var buttonsToShow = this._pagination.noButtonsBeforeDots;
        var actualIndex = this._pagination.actual;
        var limI = Math.max(actualIndex - 2, 1);
        var limS = Math.min(actualIndex + 2, this._pagination.noPages);
        var missinButtons = buttonsToShow - (limS - limI);
        if (Math.max(limI - missinButtons, 0) != 0) {
            limI = limI - missinButtons;
        }
        else if (Math.min(limS + missinButtons, this._pagination.noPages) != this._pagination.noPages) {
            limS = limS + missinButtons;
        }
        if (limS < (this._pagination.noPages - 2)) {
            pages += this.getIteratedButtons(limI, limS);
            pages += "<li>...</li>";
            pages += this.getIteratedButtons(this._pagination.noPages - 1, this._pagination.noPages);
        }
        else {
            pages += this.getIteratedButtons(limI, this._pagination.noPages);
        }
        container.innerHTML = "<ul>" + pages + "</ul>";
        //events for the buttons
        mainContainer.querySelectorAll('.pages li button').forEach(function (button) {
            button.addEventListener('click', function (e) {
                _this._pagination.actual = parseInt(e.target.getAttribute('data-page'));
                _this._pagination.pointer = (_this._pagination.actual * _this._pagination.noItemsPerPage) - _this._pagination.noItemsPerPage;
                _this.renderRows(mainContainer);
                _this.renderPagesButtons(container, mainContainer);
            });
        });
    };
    return Pagination;
}());
