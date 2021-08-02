import { permission } from './permission.model';
export interface collaborator{
    id_collaborators: string;
    id_rol: string;
    collaborator_name: string;
    collaborator_lastname: string;
    identification: string;
    collaborator_password: string;
    email: string;
    number_phone: string;
    reset_password: boolean;
    collaborator_active: boolean;
    reg_date: string;
    rol_name: string;
    rol_description: string;
    permissions: permission  [];
 }
 