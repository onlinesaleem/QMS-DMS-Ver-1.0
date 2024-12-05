// src/services/auditService.ts
import axios from 'axios';
import { AuditDto } from '../types/AuditTypes';
import { getToken } from './AuthService';
import { AuditFilterDto } from '../types/AuditFilterTypes';




const BASE_URL = 'http://localhost:8080/api/audits';
const BASE_FILE_URL = 'http://localhost:8080/api';
const FILE_API_URL = `${BASE_FILE_URL}/files`; // Updated to use BASE_URL
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export const fetchAudits = async (): Promise<AuditDto[]> => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

export const fetchAuditById = async (id: number) =>  await axios.get(`${BASE_URL}/${id}`);
 



export const createAuditWithAttachment = async (formData: FormData): Promise<any> => {
  

  const response = await axios.post(`${BASE_URL}/create-with-attachment`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};



export const deleteAudit = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const filterAudits = async (filterDto: AuditFilterDto): Promise<AuditDto[]> => {
  const response = await axios.post(`${BASE_URL}/filter`, filterDto);
  return response.data;
};

export const fetchAuditTypes=async()=> axios.get(`${BASE_URL}/auditTypes`);

// Get all audits
export const getAudits = async () => {
  try {
      const response = await axios.get(BASE_URL);
      return response.data;
  } catch (error) {
      console.error("Error fetching audits", error);
      throw error;
  }
};


// Get attachments for a specific audit
export const getAuditAttachments = async (auditId) => {
  try {
      const response = await axios.get(`${BASE_URL}/${auditId}/attachments`);
      return response.data;
  } catch (error) {
      console.error("Error fetching attachments", error);
      throw error;
  }
};
 
export const getFileBlob = async (auditId: number, fileName: string): Promise<Blob> => {
  const response = await axios.get(`${FILE_API_URL}/${auditId}/${fileName}`, {
      responseType: 'blob',
  });
  return response.data;
};

// Update Audit API call
export const updateAudit = async (
  auditId: number,
  formData: FormData
): Promise<any>  => {
  const response = await axios.put(`${BASE_URL}/audits/${auditId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
return response.data;
};

const fetchAuditResponses = async (auditId: number) => {
  const response = await fetch(`${BASE_URL}/${auditId}/responses`);
  const data = await response.json();
  return data;
};

export const fetchAuditDetails = async (auditId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/${auditId}/details`);
    return response.data; // Return the AuditDetailDto object
  } catch (error) {
    console.error('Error fetching audit details:', error);
    throw error;
  }
};

export const createAuditResponse = async (
  auditId: number, 
formData:FormData,
  file: File | null
): Promise<any> => {
  
  
  // If a file is provided, append it to the FormData
  if (file) {
    formData.append('file', file);
  }

  try {
    // Make the API request to submit the audit response
    const response = await axios.post(`${BASE_URL}/${auditId}/responses`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // Return the response data (AuditResponseDto)
  } catch (error) {
    console.error('Error creating audit response:', error);
    throw error; // Rethrow or handle the error as needed
  }
};


export const getAuditSummary = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/audits/summary`);
    return response.data; // returns an object like { totalAudits, openAudits, closedAudits, dueAudits }
  } catch (error) {
    console.error('Error fetching audit summary:', error);
    throw error;
  }
};

// Export audits to Excel
export const exportAuditsToExcel = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/audits/export/excel`, {
      responseType: 'blob', // Required to handle binary data
    });
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'audits.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};

// Export audits to PDF
export const exportAuditsToPdf = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/audits/export/pdf`, {
      responseType: 'blob', // Required to handle binary data
    });
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'audits.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};

// API to get monthly audit data (audit count per month)
export const getMonthlyAuditData = async () => {
  try {
      const response = await axios.get(`${BASE_URL}/monthly-audit-data`);
      return response.data;
  } catch (error) {
      console.error('Error fetching monthly audit data:', error);
      throw error;
  }
};

// API to get audit completion progress (completed audits per month)
export const getAuditCompletionProgress = async () => {
  try {
      const response = await axios.get(`${BASE_URL}/audit-completion-progress`);
      return response.data;
  } catch (error) {
      console.error('Error fetching audit completion progress:', error);
      throw error;
  }
};