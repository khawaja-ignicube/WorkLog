import {NavLink, useNavigate} from "react-router-dom";
import React, {useState, useEffect } from 'react';
import axios from 'axios';

const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

function Signup () {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [address, setAddress] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorUser, setUserError] = useState("");
    const [errorEmail, setEmailError] = useState("");
    const [errorPass, setPassError] = useState("");
    const [check, setCheck] = useState("false");

    let navigate = useNavigate();


    const addData = (data) => {
        
        if(username!=="" && password!=="" && password2!=="" && first_name!==""){
            apiHit.post('/create/', data)
                .then( (res) => {
                    setCheck("true")
                    console.log("ID = ",res.data.id)
                    alert("Account is created. Press OK to continue the registration");
                    navigate("/user",{state: {id:res.data.id, username:res.data.username, password: password}});
                 })
                .catch((err) => {
                    try{
                        if (err.response.data.username[0]=== 'A user with that username already exists.'){
                            //console.log("Username Issue")
                            setUserError("Username Already Exist")
                        }
                    }catch(e){ console.log("Username is OK")}

                    try{
                        if (err.response.data.email[0]!== ''){
                            //console.log("Email Issue")
                            setEmailError("Email must be unique and correct")
                        }
                    }catch(e){ console.log("Email is OK") }

                    try{
                        if (err.response.data.password[0]!== ''){
                            //console.log("Password Issue")
                            setPassError("Password must be same and long then 8 character")
                        }
                    } catch(e){console.log("Password is OK")}                    
                })
        }

        else{
            setErrorMessage("Please enter the required data first")
        }
    }

    const handleAdd = () => {
        let data = {username: username, password: password, password2: password2,email: email, 
                    first_name: first_name, last_name: last_name, address: address}      
        setEmailError("");            
        setUserError("");
        setPassError("");
        setErrorMessage("");
        addData(data);
    }

    useEffect(() => {
        console.log("Signup = ", check);
    }, [check])



    return(
        <>
            <div className="nav">
                <h2 className="title">Work Log System</h2>

                <h2 className="nav-left"> <NavLink className="sgn-btn" to = '/'>Login </NavLink> </h2>                                  
            </div>

            <div className="Auth-form-container">  

                <div className="Auth-form ">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title text-center">Signup</h3>
                        
                        
                        
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input  type="username"
                                    className="form-control mt-1"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => {setUsername( e.target.value)}}/>
                        </div>

                        {errorUser && <div className="error"> {errorUser} </div>}
                        
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input  type="password"
                                    className="form-control mt-1"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => {setPassword( e.target.value )}}/>
                        </div>

                        <div className="form-group mt-3">
                            <label>Confirm Password</label>
                            <input  type="password"
                                    className="form-control mt-1"
                                    placeholder="Enter password"
                                    value={password2}
                                    onChange={(e) => {setPassword2( e.target.value )}}/>
                        </div>

                        {errorPass && <div className="error"> {errorPass} </div>}

                        <div className="form-group mt-3">
                            <label>Email</label>
                            <input  type="email"
                                    className="form-control mt-1"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => {setEmail( e.target.value )}}/>
                        </div>

                        {errorEmail && <div className="error"> {errorEmail} </div>}

                        <div className="form-group mt-3">
                            <label>First Name</label>
                            <input  type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter first name"
                                    value={first_name}
                                    onChange={(e) => {setFirst_name( e.target.value )}}/>
                        </div>
                        
                        <div className="form-group mt-3">
                            <label>Last Name </label>
                            <input  type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter last name"
                                    value={last_name}
                                    onChange={(e) => {setLast_name( e.target.value )}}/>
                        </div>

                        <div className="form-group mt-3">
                            <label>Address </label>
                            <input  type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter address"
                                    value={address}
                                    onChange={(e) => {setAddress( e.target.value )}}/>
                        </div>

                        <br/>
                        {errorMessage && <div className="error"> {errorMessage} </div>}

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
    );
   
}

export default Signup