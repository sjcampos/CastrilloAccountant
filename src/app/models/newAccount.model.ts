export interface newAccount{
    "id_account"?: string;
    "id_father"?: string;
    "account_name"?: string;
    "account_type"?: string;
    "classification"? : string;
    "debit" ?: number;
    "credit" ?: number;
    "balance"?: number;
    "account_time"?: Date;
    "account_code"?: string;
    "id_client" ?: number;
    "id_provider" ?: number;
    "sons"?:  any [];

 }