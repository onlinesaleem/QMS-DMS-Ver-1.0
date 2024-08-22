import axios from 'axios'
import { getToken } from './AuthService';
const BASE_URL=import.meta.env.VITE_BASE_REST_API_URL ;
const BASE_REST_API_URL=BASE_URL+"/incident";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  config.headers['Authorization'] = getToken();
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

  export const getAllFloors=()=>axios.get(BASE_REST_API_URL+"/view-floors");

  export const getAllLocations=()=>axios.get(BASE_REST_API_URL+"/view-locations");

  export const getAllSeverity=()=>axios.get(BASE_REST_API_URL+"/view-severity");

  export const getAllIncidents=()=>axios.get(BASE_REST_API_URL+"/list-incidents")

  export const saveIncidents=(incidents:any)=>axios.post(BASE_REST_API_URL+"/addIncident",incidents);

  export const isAssigned=(incidentId :any)=>axios.patch(BASE_REST_API_URL+'/taskAssigned/'+incidentId);
  
  export const  fetchIncidentByReportedUser=(page:any,size:any)=>axios.get(BASE_REST_API_URL+'/incidentByUser?page='+page+'&size='+size);

  export const  fetchIncidentById=(incidentId :any)=>axios.get(BASE_REST_API_URL+'/incidentById/'+incidentId);

  export const kpiIncidentCount=(statusId:any)=>axios.get(BASE_REST_API_URL+'/kpi/inc-count/'+statusId);
  
  export const  incEventCategory=()=>axios.get(BASE_REST_API_URL+'/incCategory');

  export const addFeedback=(userFeedback:any)=>axios.post(BASE_REST_API_URL+"/addFeedback",userFeedback);

  export const  addQualityResponse=(qualityResponse:any)=>axios.post(BASE_REST_API_URL+"/addQualityResponse",qualityResponse);

  export const fetchQualityResponseByIncidentId=(incidentId:any)=>axios.get(BASE_REST_API_URL+'/fetchQualityResponseBy/'+incidentId);
  
  export const fetchIncidentMonthlyCount=()=>axios.get(BASE_REST_API_URL+"/monthly-counts");