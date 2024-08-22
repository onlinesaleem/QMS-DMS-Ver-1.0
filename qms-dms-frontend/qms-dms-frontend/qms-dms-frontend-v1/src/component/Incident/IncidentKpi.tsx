import { useEffect, useState } from 'react'
import IncidentDashboardPage from '../../pages/Dashboard/IncidentDashboardPage';
import { kpiIncidentCount } from '../../service/IncidentService';


const IncidentKpi=() =>{

  const[openInc,setOpenInc]=useState(0);
  const[closeInc,setCloseInc]=useState(0);
  
  useEffect(()=>{
    openIncident();
    closeIncident();

  },[openInc,closeInc])

   function openIncident() {
    kpiIncidentCount(1).then((response:any)=>{
      setOpenInc(response.data);
     
    }).catch((error:any)=>{
      console.log(error);
    })
    }

  
    function closeIncident() {
      kpiIncidentCount(3).then((response:any)=>{
        setCloseInc(response.data);
       
      }).catch((error:any)=>{
        console.log(error);
      })
      }
    
  
 
  return (
    
    <>
    <IncidentDashboardPage openIncident={openInc} closedIncident={closeInc} />
    </>
  )
}
export default IncidentKpi