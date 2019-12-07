export class PagingInfo {
    recordCount: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    rowsSkip: number;

    constructor(init?: Partial<PagingInfo>) {
        Object.assign(this, init);
        if (!init) {
            this.pageSize = 20;
            this.pageIndex = 0;
        }
    }
}

export class PagedList<T> {
    pagingInfo: PagingInfo = new PagingInfo();
    list: T[] = [];
    constructor(parameters?: Partial<PagedList<T>>) {
        Object.assign(this, parameters);
    }
}
