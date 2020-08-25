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
        if (settings === void 0) { settings = {
            showCheckboxes: true,
            showHeaderButtons: true,
            showSearch: true,
            numberOfEntries: 5,
            headerButtons: ['qwe', 'dfdf', 'asd']
        }; }
        this._selector = selector;
        this._data = {
            settings: settings,
            headers: [],
            items: []
        };
        this._pagination = { total: 0, noItemsPerPage: 0, noPages: 0, actual: 0, pointer: 0, diff: 0, lastPageBeforeDots: 0, noButtonsBeforeDots: 4 };
    }
    DataTable.prototype.createFromTable = function () {
        this.tokenizeTable();
        this.makeTable();
    };
    DataTable.prototype.tokenizeTable = function () {
        var _this = this;
        var _a, _b, _c;
        var el = document.querySelector(this._selector);
        if ((el === null || el === void 0 ? void 0 : el.tagName.toLowerCase()) != 'table')
            throw new Error('Table is required. ' + (el === null || el === void 0 ? void 0 : el.tagName));
        var headers = [].slice.call((_a = el.querySelector('thead tr')) === null || _a === void 0 ? void 0 : _a.children);
        var trs = [].slice.call((_b = el.querySelector('tbody')) === null || _b === void 0 ? void 0 : _b.children);
        ((_c = this._data.settings) === null || _c === void 0 ? void 0 : _c.showCheckboxes) ? this._data.headers.push('') : ''; //empty cell for the checkboxes
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
        var _a;
        container.querySelector('tbody').innerHTML = '';
        var i = 0;
        var limit = this._pagination.actual * this._pagination.noItemsPerPage;
        var _loop_1 = function () {
            if (i === this_1._pagination.total)
                return "break";
            var data = '';
            //checkbox added
            ((_a = this_1._data.settings) === null || _a === void 0 ? void 0 : _a.showCheckboxes) ? data += "<td class=\"table-checkbox\"><input type=\"checkbox\" name=\"\" id=\"\"></td>" : '';
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
        //TODO: add feature to move the buttons so the hidden ones can be shown
        mainContainer.querySelectorAll('.pages li button').forEach(function (button) {
            button.addEventListener('click', function (e) {
                _this._pagination.actual = parseInt(e.target.getAttribute('data-page'));
                _this._pagination.pointer = (_this._pagination.actual * _this._pagination.noItemsPerPage) - _this._pagination.noItemsPerPage;
                _this.renderRows(mainContainer);
                _this.renderPagesButtons(container, mainContainer);
            });
        });
    };
    DataTable.prototype.renderHeaderButtons = function () {
        var html = '';
        if (this._data.settings.showHeaderButtons) {
            this._data.settings.headerButtons.forEach(function (button) {
                html += "<li><button>" + button + "</button></li>";
            });
            return html;
        }
        else {
            return html;
        }
    };
    DataTable.prototype.createHTML = function (container) {
        var _a;
        container.innerHTML = "\n        <div class=\"datatable-container\">\n            <div class=\"header-tools\">\n                <div class=\"tools\">\n                    <ul>\n                        " + this.renderHeaderButtons() + "\n                    </ul>\n                </div>\n                " + (((_a = this._data.settings) === null || _a === void 0 ? void 0 : _a.showSearch) ? "<div class=\"search\">\n                <input type=\"text\" class=\"search-input\">\n            </div>" : '') + "\n            </div>\n            <table class=\"datatable\">\n                <thead>\n                    <tr>\n                    </tr>\n                </thead>\n                <tbody>\n                </tbody>\n            </table>\n            <div class=\"footer-tools\">\n                <div class=\"list-items\">\n                    Show\n                    <select name=\"n-entries\" id=\"n-enties\" class=\"n-entries\">\n                        <option value=\"5\">5</option>\n                        <option value=\"10\">10</option>\n                        <option value=\"15\">15</option>\n                    </select>\n                    entries\n                </div>\n                \n                <div class=\"pages\">\n                </div>\n            </div>\n        </div>\n        ";
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
        this.initPagination();
        this.renderRows(mainContainer);
        this.renderPagesButtons(pagesContainer, mainContainer);
        if (this._data.settings.showSearch) {
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
        }
        //event for list of entries
        mainContainer.querySelector('#n-enties').addEventListener('change', function (e) {
            var numberOfEntries = parseInt(e.target.value);
            _this._data.settings.numberOfEntries = numberOfEntries;
            _this.makeTable();
            _this.initPagination();
            _this.renderRows(mainContainer);
            _this.renderPagesButtons(pagesContainer, mainContainer);
        });
    };
    DataTable.prototype.onChangeEntries = function (e) {
    };
    DataTable.prototype.search = function (e, query) {
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
