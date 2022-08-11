import {useNavigate, NavLink} from "react-router-dom";
import axios from 'axios';
import { useState ,useEffect} from "react";
import Work from './ManagerWorkUC'


const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

function ManagerWorkU() {

    const [employee, setEmployee] = useState([]);
    const [employeeType, setEmployeeType] = useState("")

    const [data, setData] = useState([]);
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
        apiHit.get('/managerWork/' , { headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
               
                setEmployee(res.data.map( (userID) => {
                    return userID.work[0].employee
                }))

                if(employeeType!==""){
                    apiHit.get(`/Gwork/${employeeType}` , { headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
                    .then ( (result) => {
                        setData(result.data)
                    })
                }
               
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
                                showData()
                            })
                    }
                }catch(e){ console.log("Token is OK")}
            })
        
    }


    const userType = () => {
        var select = document.getElementById('userT');
        var option = select.options[select.selectedIndex];
        setEmployeeType(option.value);
        
    }
    
    useEffect(() => {
        //console.log("Employee Type useEffect = ", employeeType);
        showData();
    },[employeeType]);


    
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
                    
                        <NavLink className="homeBar" to = '/homeM'>Home</NavLink>
                        <NavLink className="homeBar" to = '/workA'>Add Work</NavLink>
                        <NavLink className="homeAct" to = '/workU'>Change Work</NavLink>   
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


                        <label className="mt-3">Work Log </label>
                            <div className="work mt-3">
                                
                                <br/>
                                {
                                    data.map( (value,i) => {
                                        return <Work key={i}
                                                     num = {i}
                                                     workID={value.id}
                                                     employeeID = {value.employee}
                                                     start = {value.task_start}
                                                     end = {value.task_end}
                                                     des = {value.descp}
                                                     reload={showData}
                                                />
                                    })
                                }
                            
                            </div>
                     </div>
                </div>
            </div>


            <div className="nav">
                <h5 className="footer"> Copyright Issue © 2022 Ignicube limited</h5>                             
            </div>
            
        </>
    )
}

export default ManagerWorkU