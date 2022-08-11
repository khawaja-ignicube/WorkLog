import {useLocation,useNavigate, NavLink} from "react-router-dom";
import React, {useState, useEffect } from 'react';
import axios from 'axios';

const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

function User () {

    const [userT, setUserT] = useState("");
    const [department, setDepartment] = useState("");
    const [field1, setField1] = useState("");
    const [field2, setField2] = useState("");

    const [type1, setType1] = useState("Age");
    const [type2, setType2] = useState("Salary");
    const [token, setToken] = useState("");

    const [errorDepartment, setErrorDepartment] = useState("");

    const {state} = useLocation();
    const {id, username, password} = state;

    let navigate = useNavigate();


    //Get token to create Manager/Employee
    const getToken = () => {
        
        let dataToken = {username: username, password: password}
        apiHit.post('/api/token/', dataToken)
            .then( (res) => {
                //console.log("Token in API call= ",res.data.access);
                setToken(res.data.access)
        })
    }

    const addData = (dataType) => {
        if(userT!=="" && department!=="" && field1!=="" && field2!==""){        
            
            //Hit this API if user want to register as Manager
            if(userT==='1'){
                apiHit.post('/createman/', dataType, { headers: {"Authorization" : `Bearer ${token}`} })
                .then( (res) => {
                    alert("You have been register as Manger. Press enter to redirect to login page");
                    navigate("/");
                })
                .catch((err) => {
                    try{
                        if (err.response.data.department[0]=== 'This field must be unique.'){
                            console.log("Department Issue")
                            setErrorDepartment("Manager is already exit this is department")
                        }
                    }catch(e){ console.log("Department OK")}
                })
            }
            
            //Hit this API if user want to register as Employee
            else if (userT==='2'){
                apiHit.post('/createemp/', dataType,{ headers: {"Authorization" : `Bearer ${token}`} })
                .then( (res) => {
                    alert("You have been register as Employee. Press enter to redirect to login page");
                    navigate("/");
                })
            }
        }
    }



    const userType = () => {
        //Receiving Token
        getToken();

        var select = document.getElementById('UserT');
        var option = select.options[select.selectedIndex];
        setUserT(option.value)
        setType(option.value)  
    }

    const setType = (id) => {
        if(id==="1"){
            console.log("Running 1");
            setType1("Age");
            setType2("Salary");
        }
        else if(id==="2"){
            console.log("Running 2");
            setType1("Experience");
            setType2("Height");
        }
    }

    const departmentType = () => {
        var select = document.getElementById('departmentT');
        var option = select.options[select.selectedIndex];
        setDepartment(option.value);
    }


    const handleAdd = () => {
        let dataType
        if(userT==='1'){
            dataType = {user: id, department: department, age: field1, salary: field2}      
        }
        else if (userT==='2'){
            dataType = {user: id, department: department, experience: field1, height: field2}
        }

        addData(dataType);
        setErrorDepartment("")
        //console.log("Data Type = ",dataType)
        
    }


    useEffect(() => {
        console.log("User Type useEffect = ", userT);
        console.log("Department Type useEffect = ", department);
        console.log("Token useEffect = ", token);
    }, [userT,department,token])

    return(
        <>
            <div className="nav">
                <h2 className="title">Work Log System</h2>

                <h2 className="nav-left"> <NavLink className="sgn-btn" to = '/'>Login </NavLink> </h2>                                  
            </div>

             <div className="Auth-form-container">  

                <div className="Auth-form ">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title text-center">User Type</h3>

                        <br/>

                        <label>User Type</label>
                         <select className="form-select form-control mt-1" 
                                 aria-label="Default select example" 
                                 id="UserT" onChange={userType}>
                            <option defaultValue>Select User Type</option>
                            <option value="1">Manager</option>
                            <option value="2">Employee</option>
                         </select>


                        <div className="form-group mt-3">
                            <label>User ID</label>
                            <input  type="userID"
                                    className="form-control mt-1"
                                    value={id}
                                    readOnly={true}/>
                        </div>


                        <label className="mt-3">Department</label>
                         <select className="form-select form-control mt-1" 
                                 aria-label="Default select example" 
                                 id="departmentT" 
                                 onChange={departmentType}>
                            <option defaultValue>Select Department</option>
                            <option value="1">Development</option>
                            <option value="2">Human Resource</option>
                            <option value="3">Marketing</option>
                            <option value="4">Quality Assurance</option>
                            <option value="5">Tester</option>
                            <option value="6">Content Writer</option>
                         </select>

                         {errorDepartment && <div className="error"> {errorDepartment} </div>}

                         
                        <div className="form-group mt-3">
                            <label>{type1}</label>
                            <input  type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter data"
                                    value={field1}
                                    onChange={(e) => {setField1( e.target.value)}}/>
                        </div>


                        <div className="form-group mt-3">
                            <label>{type2}</label>
                            <input  type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter data"
                                    value={field2}
                                    onChange={(e) => {setField2( e.target.value)}}/>
                        </div>
                        
                        <br/>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary" onClick={handleAdd}>
                            Submit
                            </button>
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

export default User