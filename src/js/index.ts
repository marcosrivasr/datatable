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

class DataTable{
    _selector:string;
    //_columns: string[];
    //_items:object[];
    _data:IDataTableData;
    

    constructor(selector: string, settings: ISettings = {}){
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
            //this._columns.push(element.textContent!);
            this._data.headers!.push(element.textContent!);
            //this._data.headers!.push(element.textContent!);
        });

        trs.forEach(x =>{
            const tr = <HTMLElement[]>[].slice.call(x.children);
            let row:string[] = [];
            tr.forEach(td => {
                row.push(td.textContent!)
                
            });
            //this._items.push(row);
            this._data.items!.push(row);
        });
        this._data.copy = [...this._data.items!];
        console.log(this._data.headers, this._data.items); 
    }

    private renderRows(container:HTMLElement){
        container.querySelector('tbody')!.innerHTML = '';
        this._data.copy!.forEach(rows =>{
            let data = '';
            (<string[]>rows).forEach(cell =>{
                data += `<td>${cell}</td>`
            });
            container.querySelector('tbody')!.innerHTML += `<tr>${data}</tr>`;
        });
    }

    private makeTable(){
        const old_elem = document.querySelector(this._selector)!;
        const mainContainer:HTMLElement = document.createElement("div");
        //mainContainer.classList.add('database-container');
        mainContainer.setAttribute('id', this._selector);
        document.querySelector(this._selector)?.replaceWith(mainContainer);

        mainContainer.innerHTML = `
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
                    <ul>
                        <li><span class="active">1</span></li>
                        <li><button>2</button></li>
                        <li><button>3</button></li>
                        <li><button>4</button></li>
                        <li><span>...</span></li>
                        <li><button>9</button></li>
                        <li><button>10</button></li>
                    </ul>
                </div>
            </div>
        </div>
        `;
        //this._columns.forEach(header =>{
        this._data.headers!.forEach(header =>{
            mainContainer.querySelector('thead tr')!.innerHTML += `<th>${header}</th>`;
        });

        //this._items.forEach(rows =>{
        this._data.copy!.forEach(rows =>{
            let data = '';
            (<string[]>rows).forEach(cell =>{
                data += `<td>${cell}</td>`
            });
            mainContainer.querySelector('tbody')!.innerHTML += `<tr>${data}</tr>`;
        });

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
            
            this._data.copy = [...res];
            this.renderRows(mainContainer);
            
        });

    }
}
