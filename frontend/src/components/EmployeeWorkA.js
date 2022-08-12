import {useNavigate, NavLink} from "react-router-dom";
import axios from 'axios';
import { useState ,useEffect} from "react";
import DateTimePicker from 'react-datetime-picker';


const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

function EmployeeWorkA() {

    const [employee, setEmployee] = useState();
    const [taskS, setTaskS] = useState(new Date());
    const [taskE, setTaskE] = useState(new Date());
    const [des, setDes] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    let navigate = useNavigate();


    const delCookie = () => {
        console.log("Cookie Deleted...")
        document.cookie = 'Token=; Max-Age=0;secure';
        document.cookie = 'Refresh=; Max-Age=0;secure';
        navigate('/');
    }

    const getCookie = (cookieName) => {
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
            let [key,value] = el.split('=');
            cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }


    const showData = () => {

        //Get Employee ID
        apiHit.get('/employee/' , { headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                setEmployee(res.data.id)
            })
        
    }

    const handleAdd = () => {
        setErrorMsg("")
        if(taskS!==null && taskE!==null && des!==""){

             let data =  { employee: employee, task_start: taskS.toISOString() , task_end: taskE.toISOString(), descp:des}
             apiHit.post('/addWorkEmp/' ,data ,{ headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                    console.log("Data Added...")
                    setSuccessMsg("Data is Successfully Added...")
                })
            .catch( (err) => {
                setErrorMsg("Please select the Employee ID")
            })
        }
        else{
            setErrorMsg("Please enter all the fields data")
        }
        
        setSuccessMsg("");
        
    }

    useEffect(() => {
        showData();
    },[]);


    
    return(
        <>
            <div className="nav">
                <h2 className="title">Work Log System</h2>
                <div className="logout">  
                    <button className="btn btn-light" onClick={delCookie}>Logout</button>
                </div>
            </div>

            <div className="Auth-form-container">  
                <div className="Auth-form ">
                    
                    <div className="Auth-form-contentt">
                    
                        <NavLink className="homeBar" to = '/homeED'>Home</NavLink>
                        <NavLink className="homeAct" to = '/workEA'>Add Work</NavLink>
                        <NavLink className="homeBar" to = '/workEV'>View Work</NavLink>
                    </div>

                    <br/>

                     <div className="homeData">

                        <div className="form-group mt-3">
                            <label>Employee ID </label>
                            <input  type="text"
                                    className="form-control mt-1"
                                    value = {employee}
                                    readOnly={true}/>
                        </div>
                        

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

                        <br/>
                        {errorMsg && <div className="error"> {errorMsg} </div>}
                        {successMsg && <div className="success"> {successMsg} </div>}

                        <br/>
                        <button className="btn btn-dark" onClick={handleAdd}>Add Task</button>

                     </div>
            
                </div>
            </div>




            <div className="nav">
                <h5 className="footer"> Copyright Issue © 2022 Ignicube limited</h5>                             
            </div>
            
        </>
    )
}

export default EmployeeWorkA