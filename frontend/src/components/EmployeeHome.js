import {useNavigate, NavLink} from "react-router-dom";
import axios from 'axios';
import { useState ,useEffect} from "react";


const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

function EmployeeHome() {
    const[user, setUser] = useState("");
    const[department, setDepartment] = useState("");
    const[experience, setExperience] = useState("");
    const[height, setHeight] = useState("");

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
        apiHit.get('/employee/' , { headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                setUser(res.data.user)
                setDepartment(res.data.department)
                setExperience(res.data.experience)
                setHeight(res.data.height)
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

    const handleUpdate = () => {
        setSuccessMsg("");
        setErrorMsg("");
        let data = {user:user, department: department, experience: experience, height:height}

        apiHit.put(`/employee/` ,data ,{ headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                console.log("Data updated...")
                setSuccessMsg("Data is Successfully Updated...")
            })
            .catch( (err) => {
                    try{
                            if (err.response.data.experience[0]=== 'A valid integer is required.'){
                                console.log("experience Issue")
                                setErrorMsg("Please enter correct experience")
                            }
                    }catch(e){ console.log("experience OK")}
                    
                    try{
                            if (err.response.data.height[0]=== 'A valid integer is required.'){
                                console.log("Height Issue")
                                setErrorMsg("Please enter correct height")
                            }
                    }catch(e){ console.log("height OK")}
                })
  
    }



    const departmentType = () => {
        var select = document.getElementById('departmentT');
        var option = select.options[select.selectedIndex];
        setDepartment(option.value);
        
    }


    useEffect(() => {
        //console.log("Department Type useEffect = ", department);
        showData();
    },[]);


    return(
        <>
            <div className="nav">
                <h2 className="title">Work Log System</h2>
                <h2 className="user">User ID:- {user}</h2>
                <div className="logout">  
                    <button className="btn btn-light" onClick={delCookie}>Logout</button>
                </div>
            </div>

            <div className="Auth-form-container">  
                <div className="Auth-form ">
                    
                    <div className="Auth-form-contentt">
                    
                        <NavLink className="homeAct" to = '/homeED'>Home</NavLink>
                        <NavLink className="homeBar" to = '/workEA'>Add Work</NavLink>
                        <NavLink className="homeBar" to = '/workEV'>View Work</NavLink>
                          
                    </div>

                    <br/>

                    <div className="homeData">

                        <label className="mt-3">Department</label>
                         <select className="form-select form-control mt-1" 
                                 value={department}  
                                 aria-label="Default select example" 
                                 id="departmentT" 
                                 onChange={departmentType}>
                            
                            <option value="1">Development</option>
                            <option value="2">Human Resource</option>
                            <option value="3">Marketing</option>
                            <option value="4">Quality Assurance</option>
                            <option value="5">Tester</option>
                            <option value="6">Content Writer</option>
                         </select>


                        <div className="form-group mt-3">
                                <label>Experience </label>
                                <input  type="text"
                                        className="form-control mt-1"
                                        value = {experience}
                                        onChange={(e) => { setExperience( e.target.value) }}/>
                        </div>

                        <div className="form-group mt-3">
                                <label>Height</label>
                                <input  type="text"
                                        className="form-control mt-1"
                                        value = {height}
                                        onChange={(e) => { setHeight( e.target.value) }}/>
                        </div>

                        <br/>
                        {successMsg && <div className="success"> {successMsg} </div>}
                        {errorMsg && <div className="error"> {errorMsg} </div>}

                        <br/>
                        <button className="btn btn-dark" onClick={handleUpdate}>Update</button>

                    </div>
                </div>
            </div>




            <div className="nav">
                <h5 className="footer"> Copyright Issue © 2022 Ignicube limited</h5>                             
            </div>
            
        </>
    )
}

export default EmployeeHome