interface IDataTableData{
    headers?: IHeaders,
    items?: IItemType[],
    settings?: ISettings
}
interface IHeaders{
    headers: string[]
}
interface IItemType{
    item: string | number;
}
interface ISettings{
    showCheckboxes: boolean,
    showHeaderButtons:boolean,
    showSearch: boolean,
    showEntries: boolean,
    numberOfEntries: number,
    headerButtons: string[]
}

class DataTable{
    _selector:string;
    _columns: string[];
    _items:object[];
    _data:IDataTableData;
    _settings: ISettings;
    

    constructor(selector: string, settings: ISettings){
        this._settings = settings;
        this._selector = selector;
        this._columns = [];
        this._items = [];
        this._data = {};
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
            this._columns.push(element.textContent!);
        });

        trs.forEach(x =>{
            const tr = <HTMLElement[]>[].slice.call(x.children);
            let row:string[] = [];
            tr.forEach(td => row.push(td.textContent!));
            this._items.push(row);
        });
        console.log(this._columns, this._items); 
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
                        <li><span><input type="checkbox" name="" id=""></span></li>
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
        this._columns.forEach(header =>{
            mainContainer.querySelector('thead tr')!.innerHTML += `<th>${header}</th>`;
        });

        this._items.forEach(rows =>{
            mainContainer.querySelector('tbody')!.innerHTML += `<tr>`;
            let data = '';
            (<string[]>rows).forEach(cell =>{
                data += `<td>${cell}</td>`
            });
            mainContainer.querySelector('tbody')!.innerHTML += `${data}</tr>`;
        });

    }
}
