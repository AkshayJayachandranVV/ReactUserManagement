
import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux'
import axios from 'axios';
import Swal from 'sweetalert2';

function Edit() {
  const dispatch=useDispatch()
  const navigate=useNavigate()
    const [data,SetData]=useState(null)
    const [preview,setPreview]=useState("")
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({ phone: '' });
    const [formData,setFormData]=useState({
      name:"",
      email:"",
      phone:"",
      image:""
    })

    const [selectedFile,setSelectedFile]=useState(null)

    const user=useSelector((state)=>state.user || {})
    const isAuth=useSelector((state)=>state.isAuthenticated)


 

    const token=localStorage.getItem('token')
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

        
      useEffect(() => {
        const fetchData = async () => {
          try {
            const authData = await axios.get('http://localhost:4000/user/home');
            if (!authData.data.success) {
              navigate("/login");
            } else {
              dispatch({
                type: 'login',
                payload: authData.data.value,
              });
              const userData = authData.data.value;
              setFormData({
                username: userData?.username || '',
                email: userData?.email || '',
                phone: userData?.phone || '',
                image: userData?.image || '',
              });
              setPreview(userData?.image || '');
              setLoading(false);
            }
          } catch (e) {
            console.log("Error fetching user data: " + e);
            setLoading(false);
          }
        };
    
        if (!isAuth) {
          navigate("/login");
        } else if (!user) {
          fetchData();
        } else {
          setFormData({
            username: user?.username || '',
            email: user?.email || '',
            phone: user?.phone || '',
            image: user?.image || '',
          });
          setPreview(user?.image || '');
          setLoading(false);
        }
      }, [isAuth, user, dispatch, navigate]);
    
      useEffect(() => {
        console.log(formData, "checking the state formData");
      }, [formData]);


      // useEffect(()=>{
      //   console.log("enetered vto the useEffect")
      //     const authUser=async()=>{
      //       try{
      //         console.log("entered to the try")
      //           const checkUser=await axios.get('http://localhost:4000/user/home')
      //           console.log(checkUser.data,'====++++')
      //           SetData(checkUser.data.value)
      //           setPreview(checkUser.data.value.image)
      //           console.log(data,'--------------------')
      //          if(!checkUser.data.success){     
      //           navigate("/login")
      //          }
      //       }catch(e){
      //          console.log("authUser is not working in login"+e)
      //       }
      //     }
      //     authUser()
      //   },[])


      const logOut=async()=>{
        try{
           console.log("entered to the logOut")
           localStorage.setItem('token','')
        //    navigate('/login');
           window.location.href="/login"
        }catch(e){
            console.log("Problem with the logOut"+e)
        }
     }


     const handleImage=(e)=>{
      const file=e.target.files[0]
      // setImage(e.target.files[0])
      if(file){
        setImage(file)
        const reader=new FileReader();
        reader.onloadend=()=>{
          setPreview(reader.result);
          setFormData({...formData,image:reader.result})
        }
        reader.readAsDataURL(file);
     }     
    }


      const handleInputChange=(e)=>{
            const {name,value}=e.target
            setFormData({...formData,[name]:value})
            console.log(formData , "onchange is in input")
      }

      

      const handleSubmit = async (e) => {
        try {
          e.preventDefault();
          console.log("entered to the handleSubmit");
      
          const phoneRegex = /^\d{10}$/;
          let valid = true;
          let phoneError = '';
      
          if (!phoneRegex.test(formData.phone)) {
            valid = false;
            phoneError = "Mobile Number should be 10 digits";
          }
      
          if (!valid) {
            setErrors({ phoneError });
            return;
          }
      
          console.log("1",valid,image);
      
          if (valid) {
            console.log(formData.username)
            const formDataToSend = new FormData();
            formDataToSend.append('name',formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            console.log(formDataToSend, "format data image in if ")
      
            if (image) {
              console.log(image)
              formDataToSend.append('image', image); // Assuming formData.image is the file object
            }
      
            console.log(formDataToSend , "============================================================");
      
            // try {
            //   const response = await axios.post('http://localhost:4000/user/editUser', formDataToSend, {
            //     headers: {
            //       'Content-Type': 'multipart/form-data',
            //     },
            //   });
            //   console.log(response);
            //   if (response.status === 200) {
            //     dispatch({
            //       type: 'login',
            //       payload: response.data.data,
            //     });
            //   }
            // } catch (e) {
            //   console.log("Problem with the editUser send data " + e);
            // }
            console.log("jhyyyyyyyyyyyyyyyyyyyy")

            try{
              const response = await axios.post('http://localhost:4000/user/editUser', formDataToSend,
              {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
              });
              console.log(response,"000000000000000000000000000000000000000000000000000000000000000000");
              if (response.status === 200) {
                // setSpinner(false);
                dispatch({
                  type: 'login',
                  payload: response.data.data,
              });
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Your Profile has been saved",
                showConfirmButton: false,
                timer: 1500
              });
                  navigate('/');
              }
          }catch(e){
            // setSpinner(false);
              console.log("problem eith signup axios "+e)
          }

          }
        } catch (e) {
          console.log("problem with the handle submit" + e);
        }
      };
      



     if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while data is being fetched
      }

      // const handleInputChange=(e)=>{
      //     const {name,value}=e.target;
      //     setFormData({...formData,[name]:value })
      // }


  return (
    <div className="App">
    <header className="App-header">
      <nav className="navbar">
        <div className="navbar-brand">Edit Profile</div>
        <div className="navbar-links">
          <button className="logout-button" onClick={logOut}>Logout</button>
        </div>
      </nav>
      <form className="profile-form" onSubmit={handleSubmit} >
        <div className="profile-container"> 
          <img src={preview} alt="Profile" className="profile-pic" />
          {/* <input onChange={handleImage} type="file" name="image"  accept='image/png, image/jpeg, image/webp' /> */}
          <input type="file" onChange={handleImage} accept='image/png, image/jpeg, image/webp' />
          <div className="form-group">
            <label htmlFor="username">Name:</label>
            <input 
              type="text" 
              id="username" 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email"  
              value={formData.email}
              disabled
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input 
              type="text" 
              id="phone" 
              name="phone" 
              value={formData.phone}
              onChange={handleInputChange}
            />
              {errors.phoneError && <div className="error"style={{fontSize:"14px",color:"red"}} >{errors.phoneError}</div>}
          </div>
          <button type="submit" className="submit-button">Save Changes</button>
        </div>
      </form>
    </header>
  </div>
  )
}

export default Edit