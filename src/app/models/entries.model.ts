export interface entries{
    id_account ?: number;
    account_name ?: string;
    id_collaborator?: number;
    pk? : number;
    register_date? : Date;
    account_date ?: Date;
    details ?: string;
    amount?: number;
    type_currency ?: number;
    money_chance ?: number;
    period? : number;
    fiscal_year ?: number;
}