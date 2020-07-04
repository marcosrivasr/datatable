interface IDataTableData{
    headers?: string[],
    count?: number,
    items?: object[],
    copy?: object[],
    settings?: ISettings
}
interface IItem{
    item: string | number;
}
interface ISettings{
    showCheckboxes?: boolean,
    showHeaderButtons?:boolean,
    showSearch?: boolean,
    showEntries?: boolean,
    numberOfEntries?: number,
    headerButtons?: string[]
}

interface IPagination{
    total: number,
    noItemsPerPage: number,
    noPages: number,
    actual: number,
    pointer: number,
    diff: number
}

class DataTable{
    _selector:string;
    _data:IDataTableData;
    _pagination: IPagination
    

    constructor(selector: string, settings: ISettings = {}){
        this._selector = selector;
        //this._columns = [];
        //this._items = [];
        this._data = {
            settings: settings,
            headers: [],
            items: []
        };
        this._pagination = {total: 0, noItemsPerPage:0, noPages: 0, actual:0, pointer: 0, diff: 0};
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
        
        headers.forEach(element => {
            this._data.headers!.push(element.textContent!);
        });

        trs.forEach(x =>{
            const tr = <HTMLElement[]>[].slice.call(x.children);
            let row:string[] = [];
            tr.forEach(td => {
                row.push(td.textContent!)
                
            });
            this._data.items!.push(row);
        });
        this._data.copy = [...this._data.items!];

        //configure pagination
        this._pagination.total = this._data.items!.length;
        this._pagination.noItemsPerPage = this._data.settings!.numberOfEntries!;
        this._pagination.noPages = Math.ceil(this._pagination.total / this._pagination.noItemsPerPage);
        this._pagination.actual = 1;
        this._pagination.pointer = 0;
        this._pagination.diff = this._pagination.noItemsPerPage - (this._pagination.total % this._pagination.noItemsPerPage);

        console.log(this._pagination); 
    }

    private renderRows(container:HTMLElement){
        container.querySelector('tbody')!.innerHTML = '';

        let i = 0;
        for(i = this._pagination.pointer; i < this._pagination.actual * this._pagination.noItemsPerPage; i++){
            if(i === this._pagination.total) break;
            let data = '';
            (<string[]>this._data.copy![i]).forEach(cell =>{
                data += `<td>${cell}</td>`
            });
            container.querySelector('tbody')!.innerHTML += `<tr>${data}</tr>`;
        }
    }

    private renderPagesButtons(container:HTMLElement, mainContainer:HTMLElement){
        container.innerHTML = '';
        let pages:string = '';
        if(this._pagination.noPages < 4){
            // TODO: redefine UI to not show the dots
        }else{

        }
        for(let i= 1; i <= this._pagination.noPages; i++){
            if(i === this._pagination.actual){
                pages += `<li><span class="active">${i}</span></li>`;
            }else{
                pages += `<li><button data-page="${i}">${i}</button></li>`;
            }
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

    private createHTML(container: HTMLElement){
        container.innerHTML = `
        <div class="datatable-container">
            <div class="header-tools">
                <div class="tools">
                    <ul>
                        <li><button>New</button></li>
                        <li><button>Edit</button></li>
                        <li><button>Remove</button></li>
                    </ul>
                </div>
                <div class="search">
                    <input type="text" class="search-input">
                </div>
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
                        <option value="15">5</option>
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

       this.renderRows(mainContainer);

        mainContainer.querySelector('.search-input')!.addEventListener('input', e => {
            const query = (<HTMLInputElement>e.target!).value.trim().toLowerCase();
            let res:string[][] = [];
            let isMatch:boolean = false;
            if(query === ''){
                this._data.copy = [...this._data.items!];
                this.renderRows(mainContainer);
                return false;
            }

            for(let i:number = 0; i < this._data.items!.length; i++){
                const row:string[] = <string[]>this._data.items![i];

                for(let j:number = 0; j < row.length; j++){
                    const cell = row[j];

                    if(cell.toLowerCase().indexOf(query) >= 0){
                        res.push(row);
                        break;
                    }
                }    
            }
            this._data.copy = [...res];
            this.renderRows(mainContainer);
            
        });

    }
}
