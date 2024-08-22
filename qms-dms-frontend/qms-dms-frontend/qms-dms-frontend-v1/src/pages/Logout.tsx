
//import { useNavigate } from 'react-router-dom';
import { logout } from '../service/AuthService';

const Logout = () => {
    //const navigate=useNavigate();
   const apiLogout=async()=>{
        logout();
        window.location.reload();
        window.location.href = '/';
       // navigate('/');
   
      
      
        
    }
  return (
    <>
    {
        apiLogout()
       
    }
    </>
  )
}

export default Logout