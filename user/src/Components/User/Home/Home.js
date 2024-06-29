import React, { useEffect ,useState} from "react";
import './Home.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import Spinner from "../../Spinner/Spinner";

function Home() {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    let [data,SetData] = useState(null)
    const [spinner,setSpinner]=useState(false)
    // let [user,setUser] = useState('')
    // let displayData ={
    //     id:1
    // }

    const user=useSelector((state)=>state.user)
    const isAuth=useSelector((state)=>state.isAuthenticated)
    
 
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    useEffect(()=>{
    console.log("enetered vto the useEffect")
    // console.log(user.email,"-----------------------useselector data")
      const authUser=async()=>{
        try{
          console.log("entered to the try")
            const checkUser=await axios.get('http://localhost:4000/user/home')
            console.log(checkUser.data,'====++++')
            SetData(checkUser.data.value)
            console.log(data,'--------------------')
           if(!checkUser.data.success){     
            navigate("/login")
           }else{
              dispatch({
                type:'login',
                payload:checkUser.data.value
              })
           }
        }catch(e){
           console.log("authUser is not working in login"+e)
        }
      }
      authUser()
    },[])


    const logOut=async()=>{
        try{
          // setSpinner(true)
           console.log("entered to the logOut")
           localStorage.setItem('token','')
           dispatch({
            type:'logout'
           })
        //    navigate('/login');
        // setSpinner(false)
           window.location.href="/login"
        }catch(e){
            console.log("Problem with the logOut"+e)
        }
     }
    

     const editUser=async()=>{
        try{
            console.log("entered to the editUser")
            // const editResponse=await axios.post("http://localhost:4000/user/editUser")
            // console.log(editResponse)
            navigate("/editUser")
        }catch(e){
            console.log("problem withe the editUser"+e)
        }
     }



     if (!data) {
        return <div>Loading...</div>; // Show a loading indicator while data is being fetched
      }

  return (
    <>
    {
      spinner?<Spinner />
      :
    <div className="App">
    <header className="App-header">
      <nav className="navbar">
        <div className="navbar-brand">Home Page</div>
        <div className="navbar-links">
          <button className="logout-button" onClick={logOut}>Logout</button>
        </div>
      </nav>
      <div className="profile-container">
        <img src={user?.image} alt="Profile" className="profile-pic" />
        <h1 className="profile-name">Name: {user?.username}</h1>
        <p className="profile-email">Email: {user?.email}</p>
        <p className="profile-phone">Phone: {user?.phone}</p>
        <button className="logout-button" onClick={editUser}>Edit</button>
      </div>
    </header>
  </div>
         }   
    </> 
  );
}

export default Home;
