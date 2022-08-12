import {NavLink, useNavigate} from "react-router-dom";
import axios from 'axios';
import { useState ,useEffect} from "react";

const apiHit = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

function Login (){
  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [login, setLogin] = useState("false");

    let navigate = useNavigate();


    const addData = (data) => {

        if(username!=="" && password!==""){
            apiHit.post('/token/', data)
            .then( (res) => {
                console.log("Token = ",res.data.access);
            
                if(res.data.access!==""){
                    setLogin("true");

                    const now = new Date();
                    const time = now.getTime();
                    const expireTime = time + 1000 * 22000;
                    now.setTime(expireTime);
                    document.cookie = `Token = ${res.data.access} ;expires=${now.toUTCString()}`;
                    document.cookie = `Refresh = ${res.data.refresh};expires=${now.toUTCString()}`;

                    apiHit.get('/manager/', { headers: {"Authorization" : `Bearer ${res.data.access}`} })
                    .then( () => {
                        console.log("Redirecting as Manager")
                        navigate("/homeMD");
                    })

                    .catch( (err) => {
                        //console.log("Error = ",err.response.data.detail)
                        if(err.response.data.detail==='You do not have permission to perform this action.'){    
                            console.log("Redirecting as Employee")
                            navigate("/homeED");
                        }
                    })
                
                    
                }
            })
            .catch((err) => {
                //console.log("catch err = ", err.message)
                setErrorMessage("Please enter the correct username/password")
            })
        }

        else{
            setErrorMessage("Please enter the data first")
        }
    }
    
    const handleAdd = () => {
        let data = {username: username, password: password}
        setErrorMessage("");
        addData(data);
    }

    useEffect(() => {
        console.log("Login = ", login);
    }, [login])

     
    return(
        <>
            <div className="nav">
                <h2 className="title">Work Log System</h2>

                <h2 className="nav-left"> <NavLink className="log-btn" to = '/signup'>Signup </NavLink> </h2>                                  
            </div>

            <div className="Auth-form-container">  
                <div className="Auth-form ">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title text-center">Login</h3>
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input  type="username"
                                    className="form-control mt-1"
                                    placeholder="Enter username"
                                    value = {username}
                                    onChange={(e) => { setUsername( e.target.value) }}/>
                        </div>
                        
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input  type="password"
                                    className="form-control mt-1"
                                    placeholder="Enter password"
                                    value = {password}
                                    onChange={(e) => { setPassword( e.target.value) }}/>
                        </div>

                        <br/>
                        {errorMessage && <div className="error"> {errorMessage} </div>}
                        
                        <div className="d-grid gap-2 mt-3">
                            <button className="btn btn-primary" onClick={handleAdd}>Submit</button>
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

export default Login

