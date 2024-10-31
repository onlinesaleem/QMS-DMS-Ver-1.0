import axios from 'axios';
import { getToken } from './AuthService';

const BASE_URL = import.meta.env.VITE_BASE_REST_API_URL;
const BASE_REST_API_URL = `${BASE_URL}/documents`;
const FILE_UPLOAD_URL = `${BASE_URL}/files/upload`;

const FILE_API_URL = `${BASE_URL}/files`; // Updated to use BASE_URL

axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken();
    return config;
}, function (error) {
    return Promise.reject(error);
});

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface AttachmentDTO {
    id?: number;
    fileName: string;
    filePath?: string;
    documentId?: number;
    uploadDate?: string;
}

export interface DocumentDTO {
    
    id?: number;
    title: string;
    content: string;
    departmentId:number;
    documentTypeId:number;
    effectiveDate:string;
    approvalStatus:string;
    issueDate:string;
    reviewDate:string;
    createdBy?: any;
    createdDate?: string;
    updatedBy?: any;
    updatedDate?: string;
    attachments?: AttachmentDTO[];
    documentDepartment?:Department;
    documentType?:DocumentType

}


export interface Department {
    
    id?: number;
    active?:number;
    departName:string;
    
}

export interface DocumentType{
    id?:number;
    active?:number;
    documentType:string;
}

export interface DocumentApprovalUser{
    id?:number;
    active:boolean;
    userId:number;
    approverType:string;
}
// Remove incomplete interface declaration

export const getDocumentDetailsById=(documentId:number)=>axios.get(`${BASE_REST_API_URL}/${documentId}/details`);

export const getDocuments = () => axios.get(BASE_REST_API_URL);

export const getDocumentById = (id: number) => axios.get(`${BASE_REST_API_URL}/document/${id}`);

export const getDocumentTypes=()=>axios.get(`${BASE_REST_API_URL}/document-types`);
export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(FILE_UPLOAD_URL, formData);
};

export const createDocument = ( formData: FormData) => {
    return axios.post(`${BASE_URL}/documents`, formData, {
        
    });
};

export const updateDocument = (id: number, formData: FormData) => {
    
   

    return axios.put(`${BASE_REST_API_URL}/document/${id}`, formData, {
      
    });
   
};

 // Append file if it's being updated


export const getFileUrl = (base64Data: string): string => {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    return URL.createObjectURL(blob);
};

export const downloadFile = async (documentId: number, fileName: string) => {
    const response = await api.get(`${FILE_API_URL}/${documentId}/${fileName}`, {
        responseType: 'blob', // Important for handling binary data
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Use the original file name
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const getFileBlob = async (documentId: number, fileName: string): Promise<Blob> => {
    const response = await axios.get(`${FILE_API_URL}/${documentId}/${fileName}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const approvalUserMasterSetting=async(documentApprovalUserDto:DocumentApprovalUser)=>{
    return axios.post(`${BASE_URL}/docs-workflow/approval/userSetting`,documentApprovalUserDto);
}

export const approvalUserList=async()=>{
    return axios.get(`${BASE_URL}/docs-workflow/approvals/users`);
}