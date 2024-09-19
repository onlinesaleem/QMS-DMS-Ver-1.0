import axios from "axios";
import { getToken } from "./AuthService";

const BASE_URL=import.meta.env.VITE_BASE_REST_API_URL ;
const BASE_REST_API_URL = BASE_URL+"/docs-workflow";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export interface documentApprovalLevelDto {
    
    id?: number;
     level?:number;  // Represents the approval level (e.g., 1, 2, 3)
    
    comments:string;  // Approval or rejection comments
    
    status:string;

    


}
export enum ApprovalStatus {
    PENDING,
    APPROVED,
    REJECTED
}

export const getPendingApprovals = async (userId: number) => axios.get(`${BASE_REST_API_URL}/approvals/pending/${userId}`);

export const updateApprovalStatus=async (approvalLevelId: number, documentApprovalLevel:documentApprovalLevelDto)=>axios.put(`${BASE_REST_API_URL}/approvals/${approvalLevelId}`,documentApprovalLevel)

export const resetRejectDocument=async(documentId:number,comments:string)=>axios.post(`${BASE_REST_API_URL}/documents/${documentId}/reset-rejected`,comments);

