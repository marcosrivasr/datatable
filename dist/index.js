"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var DataTable = /** @class */ (function () {
    function DataTable(selector, settings) {
        if (settings === void 0) { settings = {}; }
        this._selector = selector;
        //this._columns = [];
        //this._items = [];
        this._data = {
            settings: settings,
            headers: [],
            items: []
        };
        this._pagination = { total: 0, noItemsPerPage: 0, noPages: 0, actual: 0, pointer: 0, diff: 0 };
    }
    DataTable.prototype.createFromTable = function () {
        this.tokenizeTable();
        this.makeTable();
    };
    DataTable.prototype.tokenizeTable = function () {
        var _this = this;
        var _a, _b;
        var el = document.querySelector(this._selector);
        if ((el === null || el === void 0 ? void 0 : el.tagName.toLowerCase()) != 'table')
            throw new Error('Table is required. ' + (el === null || el === void 0 ? void 0 : el.tagName));
        var headers = [].slice.call((_a = el.querySelector('thead tr')) === null || _a === void 0 ? void 0 : _a.children);
        var trs = [].slice.call((_b = el.querySelector('tbody')) === null || _b === void 0 ? void 0 : _b.children);
        headers.forEach(function (element) {
            _this._data.headers.push(element.textContent);
        });
        trs.forEach(function (x) {
            var tr = [].slice.call(x.children);
            var row = [];
            tr.forEach(function (td) {
                row.push(td.textContent);
            });
            _this._data.items.push(row);
        });
        this._data.copy = __spreadArrays(this._data.items);
        //configure pagination
        this.initPagination();
    };
    DataTable.prototype.initPagination = function () {
        this._pagination.total = this._data.copy.length;
        this._pagination.noItemsPerPage = this._data.settings.numberOfEntries;
        this._pagination.noPages = Math.ceil(this._pagination.total / this._pagination.noItemsPerPage);
        this._pagination.actual = 1;
        this._pagination.pointer = 0;
        this._pagination.diff = this._pagination.noItemsPerPage - (this._pagination.total % this._pagination.noItemsPerPage);
    };
    DataTable.prototype.renderRows = function (container) {
        container.querySelector('tbody').innerHTML = '';
        var i = 0;
        var limit = this._pagination.actual * this._pagination.noItemsPerPage;
        var _loop_1 = function () {
            if (i === this_1._pagination.total)
                return "break";
            var data = '';
            this_1._data.copy[i].forEach(function (cell) {
                data += "<td>" + cell + "</td>";
            });
            container.querySelector('tbody').innerHTML += "<tr>" + data + "</tr>";
        };
        var this_1 = this;
        for (i = this._pagination.pointer; i < limit; i++) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
    };
    DataTable.prototype.getIteratedButtons = function (start, end) {
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
    DataTable.prototype.renderPagesButtons = function (container, mainContainer) {
        var _this = this;
        container.innerHTML = '';
        var pages = '';
        if (this._pagination.noPages < 8) {
            pages += this.getIteratedButtons(1, this._pagination.noPages);
        }
        else {
            // 1 2 3 4 ... 8 9
            pages += this.getIteratedButtons(1, 4);
            pages += "<li>...</li>";
            pages += this.getIteratedButtons(this._pagination.noPages - 1, this._pagination.noPages);
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
    DataTable.prototype.createHTML = function (container) {
        container.innerHTML = "\n        <div class=\"datatable-container\">\n            <div class=\"header-tools\">\n                <div class=\"tools\">\n                    <ul>\n                        <li><button>New</button></li>\n                        <li><button>Edit</button></li>\n                        <li><button>Remove</button></li>\n                    </ul>\n                </div>\n                <div class=\"search\">\n                    <input type=\"text\" class=\"search-input\">\n                </div>\n            </div>\n            <table class=\"datatable\">\n                <thead>\n                    <tr>\n                    </tr>\n                </thead>\n                <tbody>\n                </tbody>\n            </table>\n            <div class=\"footer-tools\">\n                <div class=\"list-items\">\n                    Show\n                    <select name=\"n-entries\" id=\"n-enties\" class=\"n-entries\">\n                        <option value=\"15\">5</option>\n                        <option value=\"10\">10</option>\n                        <option value=\"15\">15</option>\n                    </select>\n                    entries\n                </div>\n                \n                <div class=\"pages\">\n                </div>\n            </div>\n        </div>\n        ";
    };
    DataTable.prototype.makeTable = function () {
        var _this = this;
        var _a;
        var old_elem = document.querySelector(this._selector);
        var mainContainer = document.createElement("div");
        mainContainer.setAttribute('id', this._selector);
        (_a = document.querySelector(this._selector)) === null || _a === void 0 ? void 0 : _a.replaceWith(mainContainer);
        this.createHTML(mainContainer);
        var pagesContainer = document.querySelector('.footer-tools .pages');
        this.renderPagesButtons(pagesContainer, mainContainer);
        this._data.headers.forEach(function (header) {
            mainContainer.querySelector('thead tr').innerHTML += "<th>" + header + "</th>";
        });
        this.renderRows(mainContainer);
        mainContainer.querySelector('.search-input').addEventListener('input', function (e) {
            var query = e.target.value.trim().toLowerCase();
            if (query === '') {
                _this._data.copy = __spreadArrays(_this._data.items);
                _this.initPagination();
                _this.renderRows(mainContainer);
                _this.renderPagesButtons(pagesContainer, mainContainer);
                return;
            }
            _this.search(e, query);
            _this.initPagination();
            _this.renderRows(mainContainer);
            _this.renderPagesButtons(pagesContainer, mainContainer);
        });
    };
    DataTable.prototype.search = function (e, query) {
        //TODO: update buttons according to the search
        var res = [];
        this._data.copy = __spreadArrays(this._data.items);
        //find the match
        for (var i = 0; i < this._data.copy.length; i++) {
            var row = this._data.copy[i];
            for (var j = 0; j < row.length; j++) {
                var cell = row[j];
                if (cell.toLowerCase().indexOf(query) >= 0) {
                    res.push(row);
                    break;
                }
            }
        }
        this._data.copy = __spreadArrays(res);
    };
    return DataTable;
}());
