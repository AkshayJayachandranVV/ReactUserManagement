import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css';
import Login from './Components/User/Login/Login';
import Signup from './Components/User/Signup/Signup';
import Home from './Components/User/Home/Home';
import Edit from './Components/User/Edit/Edit'
import AdminLogin from './Components/Admin/AdminLogin/AdminLogin';
import AdminHome from './Components/Admin/AdminHome/AdminHome';
import AddUser from './Components/Admin/AddUser/AddUser';



function App() {
  return (
    <Router>
      <Routes>
      <Route path='/login'  element={<Login  />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/'  element={<Home />} />
      <Route path='/editUser' element={<Edit />} />
      <Route path='/admin' element={<AdminLogin />} />
      <Route path='/admin/dashboard' element={<AdminHome />} />
      <Route path='/admin/addUser' element={<AddUser />} />
    </Routes>
    </Router>
  );
}

export default App;
