"use strict";
class Pagination {
    constructor() {
        this._pagination = { total: 0, noItemsPerPage: 0, noPages: 0, actual: 0, pointer: 0, diff: 0, lastPageBeforeDots: 0, noButtonsBeforeDots: 4 };
    }
    initPagination(nItems, nEntries) {
        this._pagination.total = nItems;
        this._pagination.noItemsPerPage = nEntries;
        this._pagination.noPages = Math.ceil(this._pagination.total / this._pagination.noItemsPerPage);
        this._pagination.actual = 1;
        this._pagination.pointer = 0;
        this._pagination.diff = this._pagination.noItemsPerPage - (this._pagination.total % this._pagination.noItemsPerPage);
    }
    getIteratedButtons(start, end) {
        let res = '';
        for (let i = start; i <= end; i++) {
            if (i === this._pagination.actual) {
                res += `<li><span class="active">${i}</span></li>`;
            }
            else {
                res += `<li><button data-page="${i}">${i}</button></li>`;
            }
        }
        return res;
    }
    get limit() {
        return this._pagination.actual * this._pagination.noItemsPerPage;
    }
    get total() {
        return this._pagination.total;
    }
    get pointer() {
        return this._pagination.pointer;
    }
    set pointer(value) {
        this._pagination.pointer = value;
    }
    get actual() {
        return this._pagination.actual;
    }
    set actual(value) {
        this._pagination.actual = value;
    }
    get noPages() {
        return this._pagination.noPages;
    }
    get noButtonsBeforeDots() {
        return this._pagination.noButtonsBeforeDots;
    }
    get noItemsPerPage() {
        return this._pagination.noItemsPerPage;
    }
}
