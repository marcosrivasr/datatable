
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

    public createFromTable  (){
        const el = document.querySelector(this._selector);
        if(el?.tagName.toLowerCase() != 'table') throw new Error('Table is required');
         
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
