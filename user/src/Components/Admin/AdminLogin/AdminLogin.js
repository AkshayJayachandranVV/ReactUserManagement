import React, { useEffect, useState } from 'react';
import './AdminLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from "../../Spinner/Spinner";

const AdminLogin = () => {
    const navigate=useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [spinner, setSpinner] = useState(false);


    const token = localStorage.getItem('admintoken');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }


    useEffect(()=>{
        console.log("enetered to the user effect")
        const fetchData=async()=>{
            try{
                console.log("enetered to the fetch data")
                const allUsers=await axios.get("http://localhost:4000/admin/adminHome")
                console.log(allUsers)
                if(allUsers.data.success){
                    navigate("/admin/dashboard")
                }else{
                    navigate("/admin")
                }

            }catch(e){
                console.log("Problem with the adminhome useeffect"+e)
            }
        }
        fetchData()
    },[])

    const handleSubmit = async(event) => {
        setSpinner(true)
        event.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);

        const response = await axios.post("http://localhost:4000/admin/adminLogin", {
            email,
            password,
          });
          console.log(response)
          if(response.data.success){
            localStorage.setItem('admintoken',response.data.token)
            setSpinner(false)
            navigate('/admin/dashboard')
            console.log("reponse is success")
          } else {
            console.log('error ')
            setSpinner(false)
            setError(response.data.msg);
        }
    };

    return (
        <>
        {
          spinner?<Spinner />
          :
        <div className="login-page">
        <div className="login-box">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                {error  && <p style={{ color: 'red' , fontSize:"14px" }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
        }
    </>
    );
};

export default AdminLogin;
