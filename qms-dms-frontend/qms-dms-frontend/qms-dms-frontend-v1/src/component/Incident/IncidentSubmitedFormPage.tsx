
import { useParams } from 'react-router-dom';
import IncidentFormViewById from './IncidentFormViewById';

export default function IncidentSubmitedFormPage() {
    let  id:number;

    const { incId } = useParams<{ incId: string }>();

    if (incId !== undefined) {
     id = parseInt(incId);
     return <IncidentFormViewById PropsIncId={id}/>
    }
    else {
        return <>No id available</>
    }
      
 
  return (
    <>Test Component
    
    </>
  )
}
