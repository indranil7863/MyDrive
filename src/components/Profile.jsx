import { useEffect } from "react";
import { useState } from "react";
import "./profile.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileSizeCalculate } from "../utils/FileSizeCalculate";


const Profile = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [isloading, setIsLoading] = useState(false);

  async function FetchData() {
    try {
      const response = await fetch(`${backend_url}/user/profile`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.status === 200) {
        setUserData(data);
      } else {
        console.log("error", data.message);
      }

    } catch (error) {
      console.log("Error: ", error.message)
    }
  }

  async function LogoutHandler() {
    try {
      setIsLoading(true)
      const response = await fetch(`${backend_url}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.status === 200) {
        toast.success("logged out!")
        navigate("/register", { replace: true });

      } else {
        toast.error("Failed to login!");
      }
    } catch (error) {
      toast.error("network error!");
    }
    finally {
      isloading(false);
    }
  }

  useEffect(() => {
    FetchData();
  }, []);


  return (
    <>
      <div className="profile-container">
        <div className="first-section">
          <div className="profile-pic-container">
            <img
              className="profile-pic"
              src="https://img.icons8.com/?size=100&id=23243&format=png&color=000000"
              alt="image"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">Hi, {userData.username}</h1>
            <p>{userData.email}</p>
          </div>

        </div>
        {
          isloading ?
            (<div className=" w-full flex justify-center items-center h-[60px]">
              <div className=" w-[25px] h-[25px] border border-l-0 rounded-full border-3 animate-spin"></div>
            </div>)
            :
            (<div className="second-section">
              <button onClick={LogoutHandler}>Logout</button>
              <Link to="/">Home</Link>
            </div>)
        }

      </div>

      <div className="profile-container">
        <h1 className="text-xl font-bold" style={{ padding: "10px" }}>Your Plans {"( 2 GB Free)"}</h1>
        <div className="flex flex-col gap-2 w-full max-w-[400px] p-4 bg-white rounded-lg shadow-sm" style={{ padding: "10px" }}>

          {/* Label Row */}
          <div className="flex flex-row justify-between text-sm font-semibold text-gray-600">
            <span>{FileSizeCalculate(userData.TotalDirectorySize)} Used</span>
            <span>{FileSizeCalculate(userData.TotalUserStorage)} Total</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            {/* Dynamic Colored Progress Inner Bar */}
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((userData.TotalDirectorySize / userData.TotalUserStorage) * 100, 100)}%` }}
            />
          </div>

          {/* Optional Percentage Text Indicator */}
          <span className="text-xs text-gray-400 text-right font-medium">
            {Math.min((userData.TotalDirectorySize / userData.TotalUserStorage) * 100, 100).toFixed(0)}% full
          </span>

        </div>
      </div>
    </>
  );
};

export default Profile;
