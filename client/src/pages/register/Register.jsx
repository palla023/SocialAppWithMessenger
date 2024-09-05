import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { username, email, password, confirmPassword } = formData;

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(formData);

    const PostRegistrationForm = async () => {
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        alert("please fill the information");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        await axios.post('/auth/register', formData)
        console.log('Submitting to API:', formData);
        navigate('/login')
      } catch (err) {
        if (err.response) {
          console.error('Error:', err.response.data.message);
          alert(err.response.data.message);
        } else {
          console.error('Error:', err.message);
        }
      }

    };
    PostRegistrationForm();
    setFormData(
      {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }
    )
  }
  return (
    <div className="registration">
      <div className="registrationWrapper">
        <div className="registrationLeft">
          <h3 className="registrationLogo">SocialApp</h3>
          <span className="registrationDesc">
            Connect with friends and the world around you on SocialApp.
          </span>
        </div>
        <div className="registrationRight">
          <form className="registrationBox" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Username"
              className="registrationInput"
              name="username"
              value={username}
              onChange={changeHandler}
            />
            <input
              type="email"
              placeholder="Email"
              className="registrationInput"
              name="email"
              value={email}
              onChange={changeHandler}
            />
            <input
              type="password"
              placeholder="Password"
              className="registrationInput"
              name="password"
              value={password}
              onChange={changeHandler}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="registrationInput"
              name="confirmPassword"
              value={confirmPassword}
              onChange={changeHandler} />
            <button className="registrationButton" type="submit">Sign Up</button>
            <button className="registrationLogInButton">
              <Link to='/login' style={{ textDecoration: "none", color: "white" }}> Log into Account</Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
