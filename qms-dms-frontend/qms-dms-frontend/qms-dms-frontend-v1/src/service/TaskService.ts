import axios from 'axios'
import { getToken } from './AuthService';

const BASE_URL=import.meta.env.VITE_BASE_REST_API_URL ;
const BASE_REST_API_URL = BASE_URL+"/task";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export const getUsers = () => axios.get(BASE_REST_API_URL+'/user-list');

export const addTask = (task: any) => axios.post(BASE_REST_API_URL, task);

export const taskByUser=(page:any,size:any)=>axios.get(BASE_REST_API_URL+'/fetchTaskByUser?page='+page+'&size='+size);

export const fetchAllTask=(page:any,size:any)=>axios.get(BASE_REST_API_URL+'/fetchAllTasks?page='+page+'&size='+size);

export const fetchStatus=()=>axios.get(BASE_REST_API_URL+'/status');

export const updateTaskResponse=(id: any,taskResponse: any)=>axios.put(BASE_REST_API_URL+'/updateResponse/'+id,taskResponse);

export const incidentResponseView=(page: any, size: any, filters: { taskStatus: string; ovrStatus: string; date: string; taskNumber: string; })=>axios.get(BASE_REST_API_URL+'/taskResponse?page='+page+'&size='+size);

export const  incidentFinalReport=(taskRefId:any)=>axios.get(BASE_REST_API_URL+'/incidentReport/'+taskRefId);

export const taskIncidentByUser=(page:any,size:any)=>axios.get(BASE_REST_API_URL+'/taskIncidentByUser?page='+page+'&size='+size);

export const updateTaskUserFeedback=(id:any,taskResponse:any)=>axios.put(BASE_REST_API_URL+'/responseUserFeedBackUpdate/'+id,taskResponse);

export const taskResponseByReferenceIdandTaskTypeId=(taskReferenceId:any,taskTypeId:any)=>axios.get(BASE_REST_API_URL+'/responses'+taskReferenceId,taskTypeId);

export const taskTypesApi=()=>axios.get(BASE_REST_API_URL+'/taskTypes');

export const GeneralTaskListApi=(page:any,size:any)=>axios.get(BASE_REST_API_URL+'/general-task-list?page='+page+'&size='+size);

