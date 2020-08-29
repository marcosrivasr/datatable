interface IPagination{
    total: number,
    noItemsPerPage: number,
    noPages: number,
    actual: number,
    pointer: number,
    diff: number,
    lastPageBeforeDots:number,
    noButtonsBeforeDots:number,
}

class Pagination{

    private _pagination: IPagination;

    constructor(){
        this._pagination = {total: 0, noItemsPerPage:0, noPages: 0, actual:0, pointer: 0, diff: 0, lastPageBeforeDots: 0, noButtonsBeforeDots: 4};
    }


    public initPagination(nItems:number, nEntries:number):void{
        this._pagination.total = nItems;
        this._pagination.noItemsPerPage = nEntries;
        this._pagination.noPages = Math.ceil(this._pagination.total / this._pagination.noItemsPerPage);
        this._pagination.actual = 1;
        this._pagination.pointer = 0;
        this._pagination.diff = this._pagination.noItemsPerPage - (this._pagination.total % this._pagination.noItemsPerPage);
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

    public get limit(){
        return this._pagination.actual * this._pagination.noItemsPerPage;
    }

    public get total(){
        return this._pagination.total;
    }

    public get pointer(){
        return this._pagination.pointer;
    }
    public set pointer(value:number){
        this._pagination.pointer = value;
    }

    public get actual():number{
        return this._pagination.actual;
    }

    public set actual(value:number){
        this._pagination.actual = value;
    }

    public get noPages(){
        return this._pagination.noPages;
    }

    public get noButtonsBeforeDots(){
        return this._pagination.noButtonsBeforeDots;
    }

    public get noItemsPerPage(){
        return this._pagination.noItemsPerPage;
    }
}