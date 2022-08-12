import {useNavigate, NavLink} from "react-router-dom";
import axios from 'axios';
import { useState ,useEffect} from "react";
import DateTimePicker from 'react-datetime-picker';


const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

function ManagerWorkA() {

    const [employee, setEmployee] = useState([]);
    const [employeeType, setEmployeeType] = useState("")
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

        //Get Employee of the department
        apiHit.get('/managerEmp/' , { headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                setEmployee(res.data.map( (userID) => {
                    return userID.id
                }))
                //console.log("Employee = ", employee)
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
                                document.cookie = `Token = ${res.data.access}; SameSite=Strict; Secure`;
                                document.cookie = `Refresh = ${res.data.refresh}; SameSite=Strict; Secure`;
                                console.log("Token Updated")
                            })
                    }
                }catch(e){ console.log("Token is OK")}
            })
        
    }

    const handleAdd = () => {
        setErrorMsg("")
        if(taskS!==null && taskE!==null && des!==""){

            let data =  { employee: employeeType, task_start: taskS.toISOString() , task_end: taskE.toISOString(), descp:des}
            apiHit.post('/work/' ,data ,{ headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                    console.log("Data Added...")
                    setSuccessMsg("Data is Successfully Added...")
                })
            .catch( (err) => {
                setErrorMsg("Please select the Employee ID")
            })
        }
        else{
            setErrorMsg("Please enter all the fields data/in")
        }
        
        setSuccessMsg("");
        
    }


    const userType = () => {
        var select = document.getElementById('userT');
        var option = select.options[select.selectedIndex];
        setEmployeeType(option.value);
        
    }
    
    useEffect(() => {
        //console.log("Employee Type useEffect = ", employeeType);
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
                    
                        <NavLink className="homeBar" to = '/homeMD'>Home</NavLink>
                        <NavLink className="homeAct" to = '/workMA'>Add Work</NavLink>
                        <NavLink className="homeBar" to = '/workMU'>Update Work</NavLink>
                    </div>

                    <br/>

                     <div className="homeData">

                        <label className="mt-3">Employee </label>
                        <select className="form-select form-control mt-1"
                                aria-label="Default select example" 
                                id="userT"
                                onChange={userType}>
                            <option defaultValue>Select Employee ID</option>
                            {employee.map((option, index) => (
                                <option key={index} value={option}>Employee ID = {option}</option>
                            ))}
                        </select>

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

export default ManagerWorkA