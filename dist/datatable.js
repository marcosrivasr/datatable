"use strict";
class DataTable {
    constructor(selector, settings = {
        showCheckboxes: true,
        showHeaderButtons: true,
        showSearch: true,
        numberOfEntries: 5,
        headerButtons: []
    }) {
        this._selector = selector;
        this._data = {
            settings: settings,
            headers: [],
            items: [],
            selected: [],
            sorted: -1,
            reversed: false
        };
        this._pagination = new Pagination();
    }
    createFromTable() {
        this.tokenizeTable();
        this.makeTable();
    }
    tokenizeTable() {
        var _a, _b, _c;
        const el = document.querySelector(this._selector);
        if ((el === null || el === void 0 ? void 0 : el.tagName.toLowerCase()) != 'table')
            throw new Error('Table is required. ' + (el === null || el === void 0 ? void 0 : el.tagName));
        const headers = Array.from((_a = el.querySelector('thead tr')) === null || _a === void 0 ? void 0 : _a.children);
        const trs = Array.from((_b = el.querySelector('tbody')) === null || _b === void 0 ? void 0 : _b.children);
        ((_c = this._data.settings) === null || _c === void 0 ? void 0 : _c.showCheckboxes) ? this._data.headers.push('') : ''; //empty cell for the checkboxes
        headers.forEach(element => {
            this._data.headers.push(element.textContent);
        });
        trs.forEach(x => {
            const tr = [].slice.call(x.children);
            let item = {
                id: this.generateUUID(),
                values: []
            };
            tr.forEach(td => {
                item.values.push(td.textContent);
            });
            this._data.items.push(item);
        });
        this._data.copy = [...this._data.items];
        //console.log(this._data.copy);
        //configure pagination
        this._pagination.initPagination(this._data.copy.length, this._data.settings.numberOfEntries);
    }
    renderRows(container) {
        container.querySelector('tbody').innerHTML = '';
        let i = 0;
        const { pointer, limit, total } = this._pagination;
        for (i = pointer; i < limit; i++) {
            if (i === total)
                break;
            const { id, values } = this._data.copy[i];
            const { showCheckboxes } = this._data.settings;
            const checked = this.isChecked(id);
            let data = '';
            //checkbox added
            (showCheckboxes)
                ?
                    data += `<td class="table-checkbox">
                            <input type="checkbox" class="datatable-checkbox" data-id="${id}" ${checked ? "checked" : ""}>
                        </td>`
                : '';
            values.forEach((cell, i) => {
                let classCellSorted = '';
                if (i == this._data.sorted - 1) {
                    classCellSorted = 'cell-sorted';
                }
                data += `<td class="${classCellSorted}">${cell}</td>`;
            });
            container.querySelector('tbody').innerHTML += `<tr>${data}</tr>`;
            //checkbox event listener
            document.querySelectorAll('.datatable-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', e => {
                    const element = e.target;
                    const id = element.getAttribute('data-id');
                    if (element.checked) {
                        const item = this.getItem(id);
                        this._data.selected.push(item);
                    }
                    else {
                        this.removeSelected(id);
                    }
                    //console.log("selected", this._data.selected!);
                });
            });
        }
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
    /**
     * adasd
     * @param container
     * @param mainContainer
     */
    renderPagesButtons(container, mainContainer) {
        container.innerHTML = '';
        let pages = '';
        const buttonsToShow = this._pagination.noButtonsBeforeDots;
        const actualIndex = this._pagination.actual;
        let limI = Math.max(actualIndex - 2, 1);
        let limS = Math.min(actualIndex + 2, this._pagination.noPages);
        const missinButtons = buttonsToShow - (limS - limI);
        if (Math.max(limI - missinButtons, 0) != 0) {
            limI = limI - missinButtons;
        }
        else if (Math.min(limS + missinButtons, this._pagination.noPages) != this._pagination.noPages) {
            limS = limS + missinButtons;
        }
        if (limS < (this._pagination.noPages - 2)) {
            pages += this.getIteratedButtons(limI, limS);
            pages += `<li>...</li>`;
            pages += this.getIteratedButtons(this._pagination.noPages - 1, this._pagination.noPages);
        }
        else if (limI > (this._pagination.noPages + 2)) {
            pages += this.getIteratedButtons(0, 1);
            pages += `<li>...</li>`;
            pages += this.getIteratedButtons(limI, limS);
        }
        else {
            pages += this.getIteratedButtons(limI, this._pagination.noPages);
        }
        container.innerHTML = `<ul>${pages}</ul>`;
        //events for the buttons
        mainContainer.querySelectorAll('.pages li button').forEach(button => {
            button.addEventListener('click', e => {
                this._pagination.actual = parseInt(e.target.getAttribute('data-page'));
                this._pagination.pointer = (this._pagination.actual * this._pagination.noItemsPerPage) - this._pagination.noItemsPerPage;
                this.renderRows(mainContainer);
                this.renderPagesButtons(container, mainContainer);
            });
        });
    }
    renderHeaderButtons(container, mainContainer) {
        let html = '';
        const { showHeaderButtons, headerButtons } = this._data.settings;
        container.innerHTML = '';
        if (showHeaderButtons) {
            headerButtons.forEach(button => {
                html += `<li><button id="${button.id}">${button.text}</button></li>`;
            });
            container.innerHTML = html;
            headerButtons.forEach(button => {
                var _a;
                (_a = document.querySelector('#' + button.id)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', button.click);
            });
        }
    }
    createHTML(container) {
        var _a;
        container.innerHTML = `
        <div class="datatable-container">
            <div class="header-tools">
                <div class="tools">
                    <ul id="header-buttons-container">
                    </ul>
                </div>
                ${((_a = this._data.settings) === null || _a === void 0 ? void 0 : _a.showSearch) ? `<div class="search">
                <input type="text" class="search-input">
            </div>` : ''}
            </div>
            <table class="datatable">
                <thead>
                    <tr>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <div class="footer-tools">
                <div class="list-items">
                    Show
                    <select name="n-entries" id="n-enties" class="n-entries">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    entries
                </div>
                
                <div class="pages">
                </div>
            </div>
        </div>
        `;
    }
    makeTable() {
        var _a;
        const old_elem = document.querySelector(this._selector);
        const mainContainer = document.createElement("div");
        mainContainer.setAttribute('id', this._selector);
        (_a = document.querySelector(this._selector)) === null || _a === void 0 ? void 0 : _a.replaceWith(mainContainer);
        this.createHTML(mainContainer);
        const pagesContainer = document.querySelector('.footer-tools .pages');
        this.renderPagesButtons(pagesContainer, mainContainer);
        // render headers
        this._data.headers.forEach((header, i) => {
            mainContainer.querySelector('thead tr').innerHTML += `<th>${header}</th>`;
        });
        //evento para los headers
        document.querySelectorAll('th').forEach((header, i) => {
            header.addEventListener('click', e => {
                const index = i;
                if (e.target.textContent == '')
                    return false;
                if (this._data.sorted === index) {
                    if (!this._data.reversed) {
                        this._data.reversed = true;
                    }
                    else {
                        this._data.reversed = false;
                    }
                }
                else {
                    this._data.reversed = false;
                }
                this.sort(i - 1);
                document
                    .querySelectorAll('.datatable-container .datatable th')
                    .forEach(header => {
                    header
                        .classList
                        .remove('header-sorted');
                });
                document
                    .querySelectorAll('.datatable-container .datatable th')[index]
                    .classList
                    .add('header-sorted');
                this._data.sorted = i;
                this.renderRows(mainContainer);
            });
        });
        this._pagination.initPagination(this._data.copy.length, this._data.settings.numberOfEntries);
        this.renderRows(mainContainer);
        this.renderPagesButtons(pagesContainer, mainContainer);
        const headerButtonsContainer = document.querySelector('#header-buttons-container');
        this.renderHeaderButtons(headerButtonsContainer, mainContainer);
        if (this._data.settings.showSearch) {
            mainContainer.querySelector('.search-input').addEventListener('input', e => {
                const query = e.target.value.trim().toLowerCase();
                if (query === '') {
                    this._data.copy = [...this._data.items];
                    this._pagination.initPagination(this._data.copy.length, this._data.settings.numberOfEntries);
                    this.renderRows(mainContainer);
                    this.renderPagesButtons(pagesContainer, mainContainer);
                    return;
                }
                this.search(e, query);
                this._pagination.initPagination(this._data.copy.length, this._data.settings.numberOfEntries);
                this.renderRows(mainContainer);
                this.renderPagesButtons(pagesContainer, mainContainer);
            });
        }
        //event for list of entries
        mainContainer.querySelector('#n-enties').addEventListener('change', e => {
            const numberOfEntries = parseInt(e.target.value);
            this._data.settings.numberOfEntries = numberOfEntries;
            this.makeTable();
            this._pagination.initPagination(this._data.copy.length, this._data.settings.numberOfEntries);
            this.renderRows(mainContainer);
            this.renderPagesButtons(pagesContainer, mainContainer);
        });
    }
    sort(index) {
        this._data.copy = this._data.copy.sort((a, b) => {
            const itemA = (isNaN(parseInt(a.values[index]))) ? a.values[index][0] : a.values[index];
            const itemB = (isNaN(parseInt(b.values[index]))) ? b.values[index][0] : b.values[index];
            if (this._data.reversed) {
                if (itemA < itemB)
                    return -1;
                if (itemA > itemB)
                    return 1;
            }
            else {
                if (itemA > itemB)
                    return -1;
                if (itemA < itemB)
                    return 1;
            }
            return 0;
        });
    }
    onChangeEntries(e) {
    }
    search(e, query) {
        let res = [];
        this._data.copy = [...this._data.items];
        //find the match
        for (let i = 0; i < this._data.copy.length; i++) {
            const { id, values } = this._data.copy[i];
            const row = values;
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell.toLowerCase().indexOf(query) >= 0) {
                    res.push({ id: id, values: row });
                    break;
                }
            }
        }
        this._data.copy = [...res];
    }
    generateUUID() {
        return (Date.now() * Math.floor(Math.random() * 100000)).toString();
    }
    getItem(id) {
        const res = this._data.items.filter(item => item.id == id);
        return res[0];
    }
    removeSelected(id) {
        const res = this._data.selected.filter(item => item.id != id);
        this._data.selected = [...res];
    }
    getSelected() {
        return this._data.selected;
    }
    isChecked(id) {
        const items = this._data.selected;
        let res = false;
        //console.log("items", items.length);
        if (items.length == 0)
            return false;
        items.forEach(item => {
            console.log(item.id, id);
            if (item.id == id)
                res = true;
        });
        return res;
    }
}
