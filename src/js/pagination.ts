interface IPagination{
    total: number, //
    noItemsPerPage: number,
    noPages: number,
    actual: number,
    pointer: number,
    diff: number,
    lastPageBeforeDots:number,
    noButtonsBeforeDots:number,
}

export default class Pagination{

    private _pagination: IPagination;

    constructor(){
        this._pagination = {total: 0, noItemsPerPage:0, noPages: 0, actual:0, pointer: 0, diff: 0, lastPageBeforeDots: 0, noButtonsBeforeDots: 4};
    }


    private initPagination(nItems:number, nEntries:number):void{
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

    /* private renderPagesButtons(container:HTMLElement, mainContainer:HTMLElement){
        container.innerHTML = '';
        let pages:string = '';
        if(this._pagination.noPages < 8){
            pages += this.getIteratedButtons(1, this._pagination.noPages);
        }else{
            // 1 2 3 4 ... 8 9
            pages += this.getIteratedButtons(1, this._pagination.noButtonsBeforeDots);
            
            pages += `<li>...</li>`;

            pages += this.getIteratedButtons(this._pagination.noPages - 1, this._pagination.noPages);
        }
        

        container.innerHTML = `<ul>${pages}</ul>`;

        //events for the buttons
        //TODO: add feature to move the buttons so the hidden ones can be shown
        mainContainer.querySelectorAll('.pages li button').forEach(button => {
            button.addEventListener('click', e => {
                this._pagination.actual = parseInt((<HTMLElement>e.target!).getAttribute('data-page')!);
                this._pagination.pointer = (this._pagination.actual * this._pagination.noItemsPerPage) - this._pagination.noItemsPerPage;
                this.renderRows(mainContainer);
                this.renderPagesButtons(container, mainContainer);
            });
        });
    } */
}