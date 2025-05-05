export interface Permission {
    name: string;
    granted: boolean;
    _id: string;
  }
  
 export interface Role {
    _id: string;
    name: string;
    val: string;
    permissions: Permission[];
  }