
class DataTable{
    _selector:string;
    _columns: string[];
    _items:object[];
    _elementsPerPage:number;
    _settings: object;

    constructor(selector: string){
        this._selector = selector;
        this._columns = [];
        this._items = [];
        this._elementsPerPage = 5;
        this._settings = {
            showCheckboxes: true,
            showHeaderButtons: 'always',
            showSearch: true,
            showEntries: true,
            numberOfEntries: 5,
            headerButtons: ['New', 'Edit', 'Remove']
        };
    }

    public createFromTable(){
        
        this.tokenizeTable();
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
            tr.forEach(td =>{
                row.push(td.textContent!);
            });
            this._items.push(row);
        });
        console.log(this._columns, this._items); 
    }
}
