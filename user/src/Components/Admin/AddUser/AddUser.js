import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";
import axios from 'axios';
import Spinner from "../../Spinner/Spinner";

function SignUp() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [errors, setErrors] = useState({});
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    axios.defaults.withCredentials = true;

    const userNameValidate = () => {
        const regex = /^[a-zA-Z]+$/;
        if (userName.trim() === "") {
            setNameError("Username is Required");
            return false;
        } else if (!regex.test(userName)) {
            setNameError("Invalid Username format");
            return false;
        }
        setNameError("");
        return true;
    };

    const emailValidate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.trim() === "") {
            setEmailError("Email is Required");
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Invalid email format");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validatePhone = () => {
        const phoneRegex = /^[0-9]{9}$/;
        if (phone.trim() === '') {
            setPhoneError('Phone number is required');
            return false;
        } else if (!phoneRegex.test(phone)) {
            setPhoneError('Invalid phone number format');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const handleSubmit = async (e) => {
        setSpinner(true);
        e.preventDefault();

        const formValidation = {};
        if (!userName) {
            setSpinner(false);
            formValidation.userNameError = 'Username is required';
        }
        if (phone.length !== 10) {
            setSpinner(false);
            formValidation.mobileError = 'Mobile number should be 10 digits';
        }
        if (!email) {
            setSpinner(false);
            formValidation.emailError = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setSpinner(false);
            formValidation.emailError = 'Invalid email format';
        }
        if (password.length < 6) {
            setSpinner(false);
            formValidation.passwordError = 'Minimum 6 characters required';
        }

        setErrors(formValidation);

        if (Object.keys(formValidation).length === 0) {
            const formData = new FormData();
            formData.append('userName', userName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('image', image);

            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]}: ${pair[1].name}, ${pair[1].type}, ${pair[1].size}`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }

            try {
                const response = await axios.post('http://localhost:4000/user/signup', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response);
                if (response.status === 200) {
                    setSpinner(false);
                    navigate('/admin/dashboard');
                }
            } catch (e) {
                setSpinner(false);
                console.log("problem with signup axios " + e);
            }
        }
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            console.log("Selected file:", file); // Debugging log
        } else {
            console.log("No file selected"); // Debugging log
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <>
            {spinner ? <Spinner /> :
                <div className="App1">
                    <header className="App-header1">
                        <h1>Add User</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group1">
                                <label className="label1">Username:</label>
                                <input
                                    className="input1"
                                    value={userName}
                                    onChange={(e) => { setUserName(e.target.value); setNameError(""); userNameValidate() }}
                                    name="userName"
                                    type="text"
                                    required
                                    autoComplete="username"
                                />
                                <div className="errorMessage">{nameError}</div>
                                {errors.userNameError && <p className="errorMessage">{errors.userNameError}</p>}
                            </div>
                            <div className="form-group1">
                                <label className="label1">Email:</label>
                                <input
                                    className="input1"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); emailValidate() }}
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                />
                                <div className="errorMessage">{emailError}</div>
                                {errors.emailError && <p className="errorMessage">{errors.emailError}</p>}
                            </div>
                            <div className="form-group1">
                                <label className="label1">Phone:</label>
                                <input
                                    className="input1"
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value); validatePhone() }}
                                    name="phone"
                                    type="number"
                                    required
                                    autoComplete="number"
                                />
                                <div className="errorMessage">{phoneError}</div>
                                {errors.mobileError && <p className="errorMessage">{errors.mobileError}</p>}
                            </div>
                            <div className="form-group1">
                                <label className="label1">Password:</label>
                                <input
                                    className="input1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="password"
                                />
                                {errors.passwordError && <p className="errorMessage">{errors.passwordError}</p>}
                            </div>
                            <label className="label1">Profile Image</label>
                            {image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="userProfile"
                                />
                            )}
                            <br />
                            <input type="file" onChange={handleImage} accept="image/png, image/jpeg, image/webp" />
                            <br />
                            <button className="button1" type="submit">Add User</button>
                        </form>
                    </header>
                </div>
            }
        </>
    );
}

export default SignUp;
