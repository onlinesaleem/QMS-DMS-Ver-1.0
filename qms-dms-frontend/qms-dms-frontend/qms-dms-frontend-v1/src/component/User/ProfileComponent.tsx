
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { updatePassword } from '../../service/UserService';

export default function ProfileComponent() {
    const {userId}=useParams();
    const navigate=useNavigate();
    const[password,setPassword]=useState('');
    const[reEnterPassword,setReEnterPassword]=useState('');

    console.log("captured userid is"+userId);

    function handlePasswordChangeProcess (e:any)
    {
      e.preventDefault();
      const updatedPassword={password}
      updatePassword(userId,updatedPassword).then((response=>{
        console.log(response.data);
        alert("Password changed successfully");
        navigate('/');
      })).catch(error=>{
        console.log(error);
      })
    }

  return (
    
    <>
    <br></br> <br></br> <br></br>

    <Card style={{maxWidth:450,margin:"0 auto",padding:"20px 5px"}}>
       <CardContent>
       <Typography  variant="h5" align="center">Update Profile</Typography>
           <form>
           <Grid container spacing={1}>
          
           <Grid xs={12} item>
               <TextField label="New Password" type="password" placeholder="Enter the new password" 
               variant="outlined" fullWidth required
               value={password}
               onChange={(e)=>setPassword(e.target.value)}/>
           </Grid>
           <Grid xs={12}  item>
               <TextField label="Reenter the password" type="password" 
               placeholder="reenter the password" variant="outlined" fullWidth required
               value={reEnterPassword}
               onChange={(e)=>setReEnterPassword(e.target.value)}/>
           </Grid>
          
           <Grid xs={12}  item>
               <Button type="submit" variant="contained" fullWidth color="primary" onClick={(e)=> handlePasswordChangeProcess(e)}>Submit</Button>
           </Grid>
           </Grid>
           </form>
       </CardContent>
    </Card>
     

    </>



  )
}
