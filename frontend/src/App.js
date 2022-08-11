import { Route,Routes ,BrowserRouter} from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import User from './components/User';
import ManagerHome from './components/ManagerHome';
import ManagerWorkA from './components/ManagerWorkA';
import ManagerWorkU from './components/ManagerWorkU';


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
          <Route path="/homeM" element = {<ManagerHome/>}/>
          <Route path="/workA" element = {<ManagerWorkA/>}/>
          <Route path="/workU" element = {<ManagerWorkU/>}/>
          
          
        </Routes>
      </BrowserRouter>
  
    </>
  );
}

export default App;
