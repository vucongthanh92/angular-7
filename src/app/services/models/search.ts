export class Search {
    store: string;
    date: {
        fromDate: string;
        toDate: string;
    };
    receiptNumber: string;
    cashier: string;
    customer: {
        key: string;
        value: string;
    };
    receiptType: string;
    workstation: string;
    refund: boolean;
}
