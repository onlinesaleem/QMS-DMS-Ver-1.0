import {Button, Card, CardContent, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import  { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';
import { fetchStatus, updateTaskResponse } from '../../service/TaskService';



const TaskResponsePage = () => {

  const[responseText,setResponseText]=useState('');
  const[statusId,setStatusId]=useState('');
  const[status,setStatus]=useState([]);
  
  const navigate=useNavigate();
  const {taskId}=useParams();

  useEffect(()=>{
    listStatus();
},[])

function listStatus(){
    fetchStatus().then((response=>{
        setStatus(response.data);
    })).catch((error=>{
        console.error(error);
    }))
}

const updateResponse=async(e:any)=> {
    e.preventDefault();
    
    
    const taskResponseDatas={statusId,responseText}
    updateTaskResponse(taskId,taskResponseDatas).then((response=>{
        console.log(response.data);
        navigate('/task-list');
    })).catch((error=>{
        console.log(error);
    }))
 
//    await axios.put(`http://10.0.16.5:8080/api/task/updateResponse/${taskId}`,taskResponseDatas);
//    navigate('/task-list');
    // updateTaskResponse(taskid,taskResponseDatas).then((response=>{
    //     console.log(response.data);
    //     navigate('/task');
    // })).catch((error=>{
    //     console.log(error);
    // }))
}



  return (


        <>
        <br></br> <br></br> <br></br>

        <Card style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 5px" }}>
            <CardContent>
                <Typography variant="h5" align="center" style={{ marginBottom: '5%' }}>Task Response</Typography>
                <form>
                <Grid xs={12} item>
                                        <TextField

                                            label="Response Notes"
                                            multiline
                                            maxRows={10} fullWidth
                                            name="responseText" value={responseText} placeholder="Response Notes"
                                            onChange={(e) => setResponseText(e.target.value)} required

                                        />
                                    </Grid>

                                    <Grid xs={12} sm={6} item style={{marginTop:"2%"}}>
                                        <Typography>Status</Typography>
                                        <Select name="statusId" value={statusId} className="form-select"
                                            onChange={(e) => setStatusId(e.target.value)} required
                                        >

                                            {
                                                status.map((sts:any)=>
                                                    <MenuItem value={sts.id}>{sts.engName}</MenuItem>

                                                )}




                                        </Select>

                                    </Grid>
                                    <Grid xs={12} item style={{marginTop:"2%"}}>
                                        <Button type="submit" variant="contained" fullWidth color="primary"
                                            onClick={(e)=>updateResponse(e)}>Submit</Button>
                                    </Grid>

</form>
</CardContent>
</Card>




</>






  );
}

export default TaskResponsePage