

interface IDataTableData{
    headers?: string[],
    count?: number,
    items?: Item[],
    copy?: Item[],
    settings?: ISettings,
    selected: Item[]
}

interface ISettings{
    showCheckboxes?: boolean,
    showHeaderButtons?:boolean,
    showSearch?: boolean,
    numberOfEntries?: number,
    headerButtons?: string[]
}

interface Item{
    id: string,
    values: string[]
}


class DataTable{
    private _selector:string;
    private _data:IDataTableData;
    private _pagination:Pagination;

    constructor(selector: string, settings: ISettings = {
        showCheckboxes: true,
        showHeaderButtons: true,
        showSearch: true,
        numberOfEntries: 5,
        headerButtons: ['qwe', 'dfdf', 'asd']
    }){
        this._selector = selector;
        this._data = {
            settings: settings,
            headers: [],
            items: [],
            selected: []
        };
        this._pagination = new Pagination();
    }

    public createFromTable(){
        
        this.tokenizeTable();

        this.makeTable();
    }

    private tokenizeTable():void{
        const el = document.querySelector(this._selector);

        if(el?.tagName.toLowerCase() != 'table') throw new Error('Table is required. ' + el?.tagName);
         
        const headers = <HTMLElement[]>[].slice.call(el.querySelector('thead tr')?.children!);
        const trs = <HTMLElement[]>[].slice.call(el.querySelector('tbody')?.children!);
        
        (this._data.settings?.showCheckboxes)? this._data.headers!.push('') : ''; //empty cell for the checkboxes
        headers.forEach(element => {
            this._data.headers!.push(element.textContent!);
        }); 

        trs.forEach(x =>{
            const tr = <HTMLElement[]>[].slice.call(x.children);

            let item:Item = {
                id: this.generateUUID(),
                values: []
            }

            tr.forEach(td => {
                item.values.push(td.textContent!)
            });

            this._data.items!.push(item);
        });
        this._data.copy = [...this._data.items!];
        console.log(this._data.copy);

        //configure pagination
        this._pagination.initPagination(this._data.copy!.length, this._data.settings!.numberOfEntries!);
        
    }

    private renderRows(container:HTMLElement){
        container.querySelector('tbody')!.innerHTML = '';

        let i = 0;

        for(i = this._pagination.pointer; i < this._pagination.limit; i++){
            
            if(i === this._pagination.total) break;

            const {id, values} = this._data.copy![i];
            let data = '';

            //checkbox added
            (this._data.settings?.showCheckboxes)? data += `<td class="table-checkbox"><input type="checkbox" class="datatable-checkbox" name="" id="" data-id="${id}"></td>` : '';
            
            
            values.forEach(cell =>{
                data += `<td>${cell}</td>`
            });

            container.querySelector('tbody')!.innerHTML += `<tr>${data}</tr>`;

            //checkbox event listener
            document.querySelectorAll('.datatable-checkbox').forEach(checkbox =>{
                checkbox.addEventListener('click', e =>{
                    const element = e.target as HTMLInputElement;
                    const id:string = element.getAttribute('data-id')!;
                    
                    if(element.checked){
                        const item = this.getItem(id);

                        this._data!.selected!.push(item);
                    }else{
                        this.removeSelected(id);
                    }

                    console.log("selected", this._data.selected!);
                });
            });
        }
    }

    private getIteratedButtons(start:number, end:number):string{
        let res:string = '';
        for(let i = start; i <= end; i++){
            if(i === this._pagination.actual){
                res += `<li><span class="active">${i}</span></li>`;
            }else{
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
    private renderPagesButtons(container:HTMLElement, mainContainer:HTMLElement){
        container.innerHTML = '';
        let pages:string = '';

        const buttonsToShow:number = this._pagination.noButtonsBeforeDots;
        const actualIndex:number = this._pagination.actual;
        
        let limI:number = Math.max(actualIndex - 2, 1); 
        let limS:number = Math.min(actualIndex + 2, this._pagination.noPages);
        const missinButtons = buttonsToShow - (limS - limI);

        if(Math.max(limI-missinButtons, 0) != 0){
            limI = limI - missinButtons;
        }else if(Math.min(limS + missinButtons, this._pagination.noPages) != this._pagination.noPages){
            limS = limS + missinButtons;
        }

        if(limS < (this._pagination.noPages - 2)){
            pages += this.getIteratedButtons(limI, limS);
            pages += `<li>...</li>`;
            pages += this.getIteratedButtons(this._pagination.noPages - 1, this._pagination.noPages);
        }else{
            pages += this.getIteratedButtons(limI, this._pagination.noPages);
        }

        container.innerHTML = `<ul>${pages}</ul>`;

        //events for the buttons
        mainContainer.querySelectorAll('.pages li button').forEach(button => {
            button.addEventListener('click', e => {
                this._pagination.actual = parseInt((<HTMLElement>e.target!).getAttribute('data-page')!);
                this._pagination.pointer = (this._pagination.actual * this._pagination.noItemsPerPage) - this._pagination.noItemsPerPage;
                this.renderRows(mainContainer);
                this.renderPagesButtons(container, mainContainer);
            });
        });
    }

    private renderHeaderButtons():string{
        let html = '';
        if(this._data.settings!.showHeaderButtons){
            this._data.settings!.headerButtons!.forEach(button =>{
                html += `<li><button>${button}</button></li>`;
            });
            return html;
        }else{
            return html;
        }
    }

    private createHTML(container: HTMLElement){
        container.innerHTML = `
        <div class="datatable-container">
            <div class="header-tools">
                <div class="tools">
                    <ul>
                        ${this.renderHeaderButtons()}
                    </ul>
                </div>
                ${(this._data.settings?.showSearch)? `<div class="search">
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

    private makeTable(){
        const old_elem = document.querySelector(this._selector)!;
        const mainContainer:HTMLElement = document.createElement("div");

        mainContainer.setAttribute('id', this._selector);
        document.querySelector(this._selector)?.replaceWith(mainContainer);

        this.createHTML(mainContainer);
        const pagesContainer = <HTMLElement>document.querySelector('.footer-tools .pages');
        this.renderPagesButtons(pagesContainer, mainContainer);
        
        this._data.headers!.forEach(header =>{
            mainContainer.querySelector('thead tr')!.innerHTML += `<th>${header}</th>`;
        });

        this._pagination.initPagination(this._data.copy!.length, this._data.settings!.numberOfEntries!);
        this.renderRows(mainContainer);
        this.renderPagesButtons(pagesContainer, mainContainer);

        if(this._data.settings!.showSearch){
            mainContainer.querySelector('.search-input')!.addEventListener('input', e => {
                const query = (<HTMLInputElement>e.target!).value.trim().toLowerCase();

                if(query === ''){
                    this._data.copy = [...this._data.items!];
                    this._pagination.initPagination(this._data.copy!.length, this._data.settings!.numberOfEntries!);
                    this.renderRows(mainContainer);
                    this.renderPagesButtons(pagesContainer, mainContainer);
                    return;
                }

                this.search(e, query);

                this._pagination.initPagination(this._data.copy!.length, this._data.settings!.numberOfEntries!);
                this.renderRows(mainContainer);  
                this.renderPagesButtons(pagesContainer, mainContainer);
            });
        }

        //event for list of entries
        mainContainer.querySelector('#n-enties')!.addEventListener('change', e =>{
            const numberOfEntries:number = parseInt((<HTMLSelectElement>e.target).value);
            this._data.settings!.numberOfEntries = numberOfEntries;
            this.makeTable();
            this._pagination.initPagination(this._data.copy!.length, this._data.settings!.numberOfEntries!);
            this.renderRows(mainContainer);
            this.renderPagesButtons(pagesContainer, mainContainer); 
        });
    }

    private onChangeEntries(e: Event){
        
    }

    private search(e:Event, query:string):void{
        
        let res:Item[] = [];
        
        this._data.copy = [...this._data.items!];
        //find the match
        for(let i:number = 0; i < this._data.copy!.length; i++){
            const {id, values} = this._data.copy![i];
            const row:string[] = values;

            for(let j:number = 0; j < row.length; j++){
                const cell = row[j];

                if(cell.toLowerCase().indexOf(query) >= 0){
                    res.push({id: id, values: row});
                    break;
                }
            }    
        }
        this._data.copy = [...res];
    }

    private generateUUID(): string{
        return (Date.now() * Math.floor(Math.random() * 100000)).toString();
    }

    private getItem(id: string):Item{
        const res = this._data.items!.filter(item => item.id == id);
        return res[0];
    }

    private removeSelected(id:string):void{
        const res = this._data.selected!.filter(item => item.id != id);
        this._data.selected! = [...res];
    }

    public getSelected():Item[]{
        return this._data.selected!;
    }
}
