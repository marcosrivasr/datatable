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
        /* this._settings = {
            showCheckboxes: true,
            showHeaderButtons: 'always',
            showSearch: true,
            showEntries: true,
            numberOfEntries: 5,
            headerButtons: ['Uno', 'Dos', 'Tres']
        }; */
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
            //this._columns.push(element.textContent!);
            _this._data.headers.push(element.textContent);
            //this._data.headers!.push(element.textContent!);
        });
        trs.forEach(function (x) {
            var tr = [].slice.call(x.children);
            var row = [];
            tr.forEach(function (td) {
                row.push(td.textContent);
            });
            //this._items.push(row);
            _this._data.items.push(row);
        });
        this._data.copy = __spreadArrays(this._data.items);
        console.log(this._data.headers, this._data.items);
    };
    DataTable.prototype.renderRows = function (container) {
        container.querySelector('tbody').innerHTML = '';
        this._data.copy.forEach(function (rows) {
            var data = '';
            rows.forEach(function (cell) {
                data += "<td>" + cell + "</td>";
            });
            container.querySelector('tbody').innerHTML += "<tr>" + data + "</tr>";
        });
    };
    DataTable.prototype.makeTable = function () {
        var _this = this;
        var _a;
        var old_elem = document.querySelector(this._selector);
        var mainContainer = document.createElement("div");
        //mainContainer.classList.add('database-container');
        mainContainer.setAttribute('id', this._selector);
        (_a = document.querySelector(this._selector)) === null || _a === void 0 ? void 0 : _a.replaceWith(mainContainer);
        mainContainer.innerHTML = "\n        <div class=\"datatable-container\">\n            <div class=\"header-tools\">\n                <div class=\"tools\">\n                    <ul>\n                        <li><button>New</button></li>\n                        <li><button>Edit</button></li>\n                        <li><button>Remove</button></li>\n                    </ul>\n                </div>\n                <div class=\"search\">\n                    <input type=\"text\" class=\"search-input\">\n                </div>\n            </div>\n            <table class=\"datatable\">\n                <thead>\n                    <tr>\n                    </tr>\n                </thead>\n                <tbody>\n                </tbody>\n            </table>\n            <div class=\"footer-tools\">\n                <div class=\"list-items\">\n                    Show\n                    <select name=\"n-entries\" id=\"n-enties\" class=\"n-entries\">\n                        <option value=\"15\">5</option>\n                        <option value=\"10\">10</option>\n                        <option value=\"15\">15</option>\n                    </select>\n                    entries\n                </div>\n                \n                <div class=\"pages\">\n                    <ul>\n                        <li><span class=\"active\">1</span></li>\n                        <li><button>2</button></li>\n                        <li><button>3</button></li>\n                        <li><button>4</button></li>\n                        <li><span>...</span></li>\n                        <li><button>9</button></li>\n                        <li><button>10</button></li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n        ";
        //this._columns.forEach(header =>{
        this._data.headers.forEach(function (header) {
            mainContainer.querySelector('thead tr').innerHTML += "<th>" + header + "</th>";
        });
        //this._items.forEach(rows =>{
        this._data.copy.forEach(function (rows) {
            var data = '';
            rows.forEach(function (cell) {
                data += "<td>" + cell + "</td>";
            });
            mainContainer.querySelector('tbody').innerHTML += "<tr>" + data + "</tr>";
        });
        mainContainer.querySelector('.search-input').addEventListener('input', function (e) {
            var query = e.target.value.trim().toLowerCase();
            var res = [];
            var isMatch = false;
            if (query === '') {
                _this._data.copy = __spreadArrays(_this._data.items);
                _this.renderRows(mainContainer);
                return false;
            }
            for (var i = 0; i < _this._data.items.length; i++) {
                var row = _this._data.items[i];
                for (var j = 0; j < row.length; j++) {
                    var cell = row[j];
                    if (cell.toLowerCase().indexOf(query) >= 0) {
                        res.push(row);
                        break;
                    }
                }
            }
            /* this._data.items!.forEach(row => {
                (<string[]>row).forEach(cell => {
                    if(cell.toLowerCase().indexOf(query) > 0){
                        isMatch = true;
                    }
                });
                if(isMatch){
                    res.push((<string[]>row));
                    isMatch = false;
                }
            }); */
            _this._data.copy = __spreadArrays(res);
            _this.renderRows(mainContainer);
        });
    };
    return DataTable;
}());
