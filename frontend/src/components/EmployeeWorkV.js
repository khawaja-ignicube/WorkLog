import {useNavigate, NavLink} from "react-router-dom";
import axios from 'axios';
import { useState ,useEffect} from "react";
import EmployeeWorkVM from './EmployeeWorkVM'


const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

function EmployeeWorkV() {

    const [employee, setEmployee] = useState([]);
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
        apiHit.get('/workEmp/' , { headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                setEmployee(res.data[0].employee)
                setData(res.data)
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
                                showData()
                            })
                    }
                }catch(e){ console.log("Token is OK")}
            })
        
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
                        <NavLink className="homeBar" to = '/workEA'>Add Work</NavLink>
                        <NavLink className="homeAct" to = '/workEV'>Change Work</NavLink>   
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

 
                        <label className="mt-3">Work Log </label>
                            <div className="work mt-3">
                                
                                <br/>
                                {
                                    data.map( (value,i) => {
                                        return <EmployeeWorkVM key={i}
                                                     num = {i}
                                                     workID={value.id}
                                                     start = {value.task_start}
                                                     end = {value.task_end}
                                                     des = {value.descp}
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

export default EmployeeWorkV