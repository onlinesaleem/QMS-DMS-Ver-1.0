import axios from 'axios';
import { getToken } from './AuthService';

const BASE_URL = import.meta.env.VITE_BASE_REST_API_URL;
const BASE_REST_API_URL = `${BASE_URL}/templates`;

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export interface TemplateDTO {
  id?: number;
  name: string;
  content: string;
  departmentId: number;
  createdBy?: any;
  createdDate?: string;
  updatedBy?: any;
  updatedDate?: string;
}

export const getTemplates = () => axios.get(BASE_REST_API_URL);

export const createTemplate = (template: TemplateDTO) => axios.post(BASE_REST_API_URL, template);

export const getTemplateById = (id: number) => axios.get(`${BASE_REST_API_URL}/template/${id}`);
