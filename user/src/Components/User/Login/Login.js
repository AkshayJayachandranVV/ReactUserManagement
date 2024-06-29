import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";



function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch=useDispatch()
  axios.defaults.withCredentials = true;

  const token=localStorage.getItem('token')
  if(token){
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`
  }


  useEffect(()=>{
    console.log("enetered vto the useEffect")
      const authUser=async()=>{
        try{
          console.log("entered to the try")
            const checkUser=await axios.get('http://localhost:4000/user/home')
           console.log(checkUser.data ,"---------payload adata")
           if(checkUser.data.success){
            navigate("/") 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      const response = await axios.post("http://localhost:4000/user/login", {
        email,
        password,
      });
      setSpinner(false);
      console.log(response.data , " login payloada datachecking-----------==========");

      if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            dispatch({
              type:'login',
              payload:response.data.data
            })
            setSpinner(false);
              navigate("/");
      } else {
        setError(response.data.message);
      }
      console.log("Entered to the login");
    } catch (e) {
      console.log("Problem wothe the handlesubmit" + e);
    }
  };

  const handleSignup=()=>{
    navigate("/signup")
  }

  return (
    <>
    {
      spinner?<Spinner />
      :
    <div className="App">
      <header className="App-header">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          {error  && <p style={{ color: 'red' , fontSize:"14px" }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p style={{color:"blue", fontSize: '20px'}} onClick={handleSignup} >Signup ?</p>
      </header>
    </div>
 }
    </>
  );
}

export default Login;
