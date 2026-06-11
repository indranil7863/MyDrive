import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Register = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [isloading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [issignin, setIsSignIn] = useState(true);
  const [errorData, setErrorData] = useState("");

  function toggleHandler() {
    setIsSignIn((prev) => !prev);
    setInputData({ name: "", email: "", password: "" });
    setErrorData("");
  }

  function forgetPasswordHandler() {
    // call forget password api
  }

  async function SingupHandler(e) {
    e.preventDefault();

    // call api signup & login
    if (issignin) {
      // sign in
      setIsLoading(true);
      try {
        const response = await fetch(`${backend_url}/user/signin`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            email: inputData.email,
            password: inputData.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (response.status === 200) {
          toast.success("successful Login!")
          navigate("/", { replace: true });
        } else {
          setErrorData(data.message);
          toast.error("Login failed!")
        }
      } catch (error) {
        toast.error("Network Error!");
      } finally {
        setIsLoading(false);
      }
    } else {
      // registration
      setIsLoading(true);
      try {
        const response = await fetch(`${backend_url}/user/register`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(inputData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          navigate('/verify');
        } else {
          setErrorData(data.error);
          toast.error(errorData);
        }
      } catch (error) {
        toast.error("Network Error!");
      } finally {
        setIsLoading(false);
      }
    }
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
      <form onSubmit={SingupHandler} className="register-container">
        <section className="register-sec1 lg:w-[50%]">
          {/*  form section */}
          <div className="section1-name">
            <h2>Welcome Back</h2>
            <p>Welcome backf Please enter your details</p>
          </div>
          {!issignin && (
            <div className="input-box0">
              <p>
                Name <span className="star">*</span>
              </p>
              <input
                placeholder="Enter your Name"
                type="text"
                name="name"
                id=""
                onChange={(e) => handleInput(e)}
                value={inputData.name}
                required
              />
            </div>
          )}

          <div className="input-box1">
            <p>
              Email<span className="star">*</span>
            </p>
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              id="Email"
              onChange={(e) => handleInput(e)}
              value={inputData.email}
              required
            />
          </div>

          <div className="input-box2">
            <p>
              Password<span className="star">*</span>
            </p>
            <input
              placeholder="Enter your password"
              type="password"
              name="password"
              id="Password"
              value={inputData.password}
              onChange={(e) => handleInput(e)}
              required
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
          <p className="error-message">{errorData}</p>
          {
            isloading ?
              (<button className="section1-button">
                <div className=" w-[25px] h-[25px] border border-l-0 rounded-full border-3 animate-spin"></div>
              </button>)
              :
              (
                <button type="submit" className="section1-button" disabled={isloading}>
                  {issignin ? "Sign In" : "Sign Up"}
                </button>
              )
          }

          <div className="section1-footer">
            <span>
              {issignin ? "don't have an account?" : "already have an account?"}
            </span>
            <span className="section1-toggler" onClick={toggleHandler}>
              {issignin ? "Sign up" : "Sign In"}
            </span>
          </div>
        </section>
        <section className="register-sec2 hidden lg:flex">
          {/* image section */}
          <img
            src="https://media.istockphoto.com/id/2208418091/photo/document-management-system-dms-folder-structure-and-classification-system-file-and-folder.jpg?s=612x612&w=0&k=20&c=3e3nvT--j6bNg4xzWc_tUTyhP27kfolxuVrF86u34Xk="
            alt="img"
          />
        </section>
      </form>

    </div>
  );
};

export default Register;
