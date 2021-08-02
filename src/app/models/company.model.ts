export interface company{
    id_company : string;
    company_name : string;
    agent : string;
    number_phone : string;
    main_email : string;
    company_password : string;
    collaborators : [];
    company_active : boolean;
    slug : string;
    tenant: string;
}