
interface IDataTableData{
    _columns: string[],
    _items:object[]
}


class DataTable implements IDataTableData{

    _selector:string;
    _columns: string[];
    _items:object[];

    constructor(selector: string){
        this._selector = selector;
        this._columns = [];
        this._items = [];
    }

    public create(){
        const el = document.querySelector(this._selector);
        if(el?.tagName.toLowerCase() != 'table') throw new Error('Table is required');
        
        const headers = <HTMLElement[]>[].slice.call(el.querySelector('thead tr')?.children!);
        
        headers.forEach(element => {
            this._columns.push(element.textContent!);
        });

        console.log(this._columns);
        
    }
}
