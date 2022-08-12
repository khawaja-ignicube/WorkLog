import DateTimePicker from 'react-datetime-picker';
import React, { useState } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})



function Work(props){

    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    
    var dateS = new Date(props.start)
    var dateE = new Date(props.end)

    const [taskS, setTaskS] = useState(dateS);
    const [taskE, setTaskE] = useState(dateE);
    const [des, setDes] = useState(props.des);

    const [delMsg, setDelMsg] = useState("");
    const [updMsg, setUpdMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");


    const handleCloseUpdate = () => {
        setShowUpdate(false);
        setUpdMsg("");
    }
    const handleShowUpdate = () => {
        setShowUpdate(true);
        setTaskS(dateS);
        setTaskE(dateE);
        setDes(props.des)
    }


    const handleCloseDelete = () => {
        setShowDelete(false);
        setDelMsg("");
    }
    const handleShowDelete = () => {
        setShowDelete(true);
    }


    const getCookie = (cookieName) => {
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
            let [key,value] = el.split('=');
            cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }


    const UpdateData = () => {
        setErrorMsg("")
        if(taskS!==null && taskE!==null && des!==""){

            let data = {employee: props.employeeID, task_start: taskS.toISOString(), task_end:taskE.toISOString(), descp:des}            
            apiHit.put(`/Uwork/${props.workID}`, data ,{ headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                //console.log("Result = ",res.data);
                console.log("Data Updated...")
                setUpdMsg("The Data is successfully Updates");
                props.reload()
            })
            .catch( (err) => {
                try{
                    //console.log("Msg = ",err.response.data)
                    if (err.response.data.detail=== 'Given token not valid for any token type'){
                        console.log("Token Issue")
                        let data = {refresh: getCookie("Refresh")}
                        //console.log("Access = ",getCookie("Refresh"))
                        apiHit.post('/token/refresh/' , data)
                            .then ( (res) => {
                                //console.log("New Access = ",res.data)
                                document.cookie = `Token = ${res.data.access}`;
                                document.cookie = `Refresh = ${res.data.refresh}`;
                                console.log("Token Updated")
                            })
                    }
                }catch(e){ console.log("Token is OK")}
            })
            
        }
        else{
            setErrorMsg("Please enter all the fields data")
        }
    }



    const DeleteData = () => {
        apiHit.delete(`/Uwork/${props.workID}` ,{ headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                //console.log("Result = ",res.data)
                console.log("Data Deleted...")
                setDelMsg("The Data is successfully delete")
                setTimeout(() => {  
                    props.reload()
                }, 2000);
            })
            .catch( (err) => {
                try{
                    //console.log("Msg = ",err.response.data)
                    if (err.response.data.detail=== 'Given token not valid for any token type'){
                        console.log("Token Issue")
                        let data = {refresh: getCookie("Refresh")}
                        //console.log("Access = ",getCookie("Refresh"))
                        apiHit.post('/token/refresh/' , data)
                            .then ( (res) => {
                                //console.log("New Access = ",res.data)
                                document.cookie = `Token = ${res.data.access}`;
                                document.cookie = `Refresh = ${res.data.refresh}`;
                                console.log("Token Updated")
                            })
                    }
                }catch(e){ console.log("Token is OK")}
            })
        
    }


    return (
        <> 
            <div className="workData"> 
                <h5>Task  {props.num+1}</h5>

                <div className="form-group mt-3">
                    <label>Task Start Date and Time </label>
                    <div>
                        <DateTimePicker className="mt-1"
                            value={taskS}
                            readOnly={true}/>
                    </div>
                </div>

                <div className="form-group mt-3">
                    <label>End  Date and Time </label>
                    <div>
                        <DateTimePicker className="mt-1"
                            value={taskE}
                            readOnly={true}/>
                    </div>
                </div>

                <div className="form-group mt-3">
                        <label>Task Description </label>
                        <input  type="text"
                                className="form-control mt-1"
                                value = {props.des}
                                readOnly={true}/>
                </div>

                <br/>
                <Button className='btn btn-dark' onClick={handleShowUpdate}>
                    Update Task 
                </Button>

                <h1 className='del-btn'>
                    <Button className='btn btn-dark' onClick={handleShowDelete}>
                         Delete Task 
                    </Button>
                </h1>

            </div>






            
            {/* Update Modal Part */}
            <Modal
                show={showUpdate}
                onHide={handleCloseUpdate}
                backdrop="static"
                keyboard={false}>

                <Modal.Header closeButton>
                    <Modal.Title>WorkLog Task = {props.workID}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    
                    <div className="form-group mt-3">
                        <label>Task Start Date and Time </label>
                        <div>
                            <DateTimePicker className="mt-1"
                                value={taskS}
                                onChange={setTaskS}/>
                        </div>
                    </div>
                        
                    <div className="form-group mt-3">
                        <label>End  Date and Time </label>
                        <div>
                            <DateTimePicker className="mt-1"
                                value={taskE}
                                onChange={setTaskE}/>
                        </div>
                    </div>
         
                    <div className="form-group mt-3">
                        <label>Task Description </label>
                        <input  type="text"
                                className="form-control mt-1"
                                value = {des}
                                onChange={(e) => { setDes( e.target.value) }}/>
                    </div>

                    {errorMsg && <div className="error mt-2"> {errorMsg} </div>}
                    {updMsg && <div className="success mt-2"> {updMsg} </div>}

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdate}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={UpdateData}>Update</Button>
                </Modal.Footer>
            </Modal>



            {/* Delete Modal Part */}
             <Modal
                show={showDelete}
                onHide={handleCloseUpdate}
                backdrop="static"
                keyboard={false}>

                <Modal.Header closeButton>
                    <Modal.Title>WorkLog Task = {props.workID}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    Are you sure you want to delete this task.?
                    {delMsg && <div className="success mt-2"> {delMsg} </div>}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={DeleteData}>Delete</Button>
                </Modal.Footer>
            </Modal>
           
        </>
    )
}

export default Work



