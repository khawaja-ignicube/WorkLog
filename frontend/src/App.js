import { Route,Routes ,BrowserRouter} from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import User from './components/User';
import ManagerHome from './components/ManagerHome';
import ManagerWorkA from './components/ManagerWorkA';
import ManagerWorkU from './components/ManagerWorkU';

import EmployeeHome from "./components/EmployeeHome";
import EmployeeWorkA from "./components/EmployeeWorkA";
import EmployeeWorkV from "./components/EmployeeWorkV";


import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import "./App.css"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Login/>}/>
          <Route path="/signup" element = {<Signup/>}/>
          <Route path="/user" element = {<User/>}/>
          <Route path="/homeMD" element = {<ManagerHome/>}/>
          <Route path="/workMA" element = {<ManagerWorkA/>}/>
          <Route path="/workMU" element = {<ManagerWorkU/>}/>

          <Route path="/homeED" element = {<EmployeeHome/>}/>
          <Route path="/workEA" element = {<EmployeeWorkA/>}/>
          <Route path="/workEV" element = {<EmployeeWorkV/>}/>
          
          
        </Routes>
      </BrowserRouter>
  
    </>
  );
}

export default App;
