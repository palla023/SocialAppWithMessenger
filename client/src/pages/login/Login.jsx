import { useContext, useState } from "react";
import "./login.css";
import { Link } from 'react-router-dom';
import { loginCall } from '../../apiCalls'
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from '@material-ui/core';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { email, password } = formData;
  // const [data, setData] = useState({});
  // const [errors, setErrors] = useState({});

  const { isFetching, user, dispatch } = useContext(AuthContext)

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if ( !email.trim() || !password.trim() ) {
      alert("please fill the information");
      return;
    }
    
    await loginCall(formData, dispatch)  
    setFormData({
      email: "",
      password: ""
    })
  }


  console.log(user);
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialApp</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on SocialApp.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={submitHandler}>
            <input type='email' 
            placeholder="Email" 
            className="loginInput" 
            name="email" value={email} 
            onChange={changeHandler} />
            <input type='password' placeholder="Password" className="loginInput" name="password" value={password} onChange={changeHandler} />
            <button className="loginButton" type="submit" >
              {isFetching ? < CircularProgress color="white" size="25px" /> : "Log In"}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton" >
              {/* {isFetching ? < CircularProgress color="white" size="25px" /> : "Create a New Account"} */}
              <Link to='/register' style={{ textDecoration: "none", color: "white" }}>Create a New Account </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
