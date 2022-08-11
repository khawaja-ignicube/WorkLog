import {useNavigate, NavLink} from "react-router-dom";
import axios from 'axios';
import { useState ,useEffect} from "react";


const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

function ManagerHome() {
    const[user, setUser] = useState("");
    const[department, setDepartment] = useState("");
    const[age, setAge] = useState("");
    const[salary, setSalary] = useState("");

    const [errorDepartment, setErrorDepartment] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

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
        apiHit.get('/manager/' , { headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                setUser(res.data.user)
                setDepartment(res.data.department)
                setSalary(res.data.salary)
                setAge(res.data.age)
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

    const handleUpdate = () => {
        let data = {user:user, department: department, salary: salary, age:age}

        apiHit.put(`/manager/` ,data ,{ headers: {"Authorization" : `Bearer ${getCookie("Token")}`} })
            .then( (res) => {
                console.log("Data updated...")
                setSuccessMsg("Data is Successfully Updated...")
            })
            .catch( (err) => {
                try{
                        if (err.response.data.department[0]=== 'This field must be unique.'){
                            console.log("Department Issue")
                            setErrorDepartment("Manager is already exit this is department")
                        }
                }catch(e){ console.log("Department OK")}
            })
        
            
            setErrorDepartment("");
            setSuccessMsg("");
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
                    
                    <div className="Auth-form-content">
                    
                        <NavLink className="homeAct" to = '/homeM'>Home</NavLink>
                        <NavLink className="homeBar" to = '/workA'>Add Work</NavLink>
                        <NavLink className="homeBar" to = '/workU'>Change Work</NavLink>   
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

                        {errorDepartment && <div className="error"> {errorDepartment} </div>}

                        <div className="form-group mt-3">
                                <label>Salary </label>
                                <input  type="text"
                                        className="form-control mt-1"
                                        value = {salary}
                                        onChange={(e) => { setSalary( e.target.value) }}/>
                        </div>

                        <div className="form-group mt-3">
                                <label>Age</label>
                                <input  type="text"
                                        className="form-control mt-1"
                                        value = {age}
                                        onChange={(e) => { setAge( e.target.value) }}/>
                        </div>

                        <br/>
                        {successMsg && <div className="success"> {successMsg} </div>}

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

export default ManagerHome