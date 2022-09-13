export interface CodeName {
    code: string,
    name: string,
}

export interface SaleReport {
    id: number,
    currency: CodeName,
    dateAccIn: string,
    agent: CodeName,
    pointOfSale: CodeName,
    dts: CodeName,
    storno: number,
}

export interface AgentsResponse {
    agents: Array<CodeName>,
}

export interface SaleReportsResponse {
    count: number,
    items: Array<SaleReport>,
}

export interface Column {
    field: string
    header: string,
}
