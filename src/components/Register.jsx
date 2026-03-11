import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const [issignin, setIsSignIn] = useState(true);
  function toggleHandler() {
    setIsSignIn((prev) => !prev);
  }

  function forgetPasswordHandler() {
    // call forget password api
  }
  function SingupHandler() {
    // call api signup & login
    setIsSignIn(true);
  }

  function handleInput(e) {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <div>
      <div className="register-wrapper"></div>
      <div className="register-container">
        <section className="register-sec1">
          {/*  form section */}
          <div className="section1-name">
            <h2>Welcome Back</h2>
            <p>Welcome backf Please enter your details</p>
          </div>

          <div className="input-box1">
            <p>Email</p>
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              id="Email"
              onChange={(e) => handleInput(e)}
              value={inputData.email}
            />
          </div>

          <div className="input-box2">
            <p>Password</p>
            <input
              placeholder="Enter your password"
              type="password"
              name="password"
              id="Password"
              value={inputData.password}
              onChange={(e) => handleInput(e)}
            />
          </div>
          <div className="section1-checkbox">
            <label htmlFor="check">
              <input
                type="checkbox"
                name=""
                id="check"
                className="input-checkbox"
              />
              Remember me
            </label>
            {issignin && (
              <span onClick={forgetPasswordHandler} className="forget-password">
                Forget Password
              </span>
            )}
          </div>
          <button className="section1-button">
            {issignin ? "Sign In" : "Sign Up"}
          </button>
          <div className="section1-footer">
            <span>already have an account?</span>
            <span className="section1-toggler" onClick={toggleHandler}>
              {issignin ? "Sign up" : "Sign In"}
            </span>
          </div>
        </section>
        <section className="register-sec2">
          {/* image section */}
          <img
            src="https://media.istockphoto.com/id/2208418091/photo/document-management-system-dms-folder-structure-and-classification-system-file-and-folder.jpg?s=612x612&w=0&k=20&c=3e3nvT--j6bNg4xzWc_tUTyhP27kfolxuVrF86u34Xk="
            alt="img"
          />
        </section>
      </div>
    </div>
  );
};

export default Register;
