import React,{useState,useEffect} from 'react'
import './AdminHome.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminHome() {
    const [userData, setUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate=useNavigate()


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
                if(allUsers.data.data){
                    setUserData(allUsers.data.data)
                }

            }catch(e){
                console.log("Problem with the adminhome useeffect"+e)
            }
        }
        fetchData()
    },[])

    const onLogout=()=>{
        console.log("entered to the logout")
        localStorage.setItem('admintoken','')
        window.location.href ='/admin'
    }

    const handleSearch=(e)=>{
        console.log(e.target.value)
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm)
        console.log(userData)
        
        // console.log(filtered,"==============")
        // setUserData(filtered) 
    }


    const filtered =  userData.filter((user)=> user.username.toLocaleLowerCase().includes(searchTerm)) 


    console.log(filtered,"99999999999999999999",searchTerm)


    const deleteUser=async(email)=>{
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async(result)=>{
            if(!result.isConfirmed){
                return;
            }
            try{
                const response = await axios.post('http://localhost:4000/admin/deleteUser', { email });
                if (response.data.success) {
                    setUserData(userData.filter(user => user.email !== email));
                }
                console.log(response)
            }catch(e){
                console.log("Problem with the deleteuser"+e)
            }
        })
    }


    const addUser=()=>{
        navigate("/admin/addUser")
    }
    
    

  return (
    <div className="admin-home">
            <header className="admin-header">
                <div className="admin-info">
                    {/* <h1>Welcome, {adminName}</h1> */}
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm} 
                        onChange={handleSearch} 
                    />
                </div>
            </header>
            <br></br>
            <button className="logout-button" variant="outline-danger" onClick={() => addUser()}>Add User</button>
            <br></br>
            <main className="admin-main">
           
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>SI.No</th>
                            <th>User</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone No</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filtered.map((user,index) => (
                            <tr key={index+1}>
                                <td>{index + 1}</td>
                                <td><img src={user?.image} alt="" style={{ height: '80px', width: '100px' }} /></td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>
                                <button className="logout-button" variant="outline-danger" onClick={() => deleteUser(user.email)}>X</button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
  )
}

export default AdminHome
