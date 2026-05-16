import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./profile.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  async function FetchData() {
    try {
      const response = await fetch(`http://localhost:4000/user/profile`, {
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
      const response = await fetch("http://localhost:4000/user/logout", {
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
  }

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="profile-container">
      <div className="first-section">
        <div className="profile-pic-container">
          <img
            className="profile-pic"
            src="https://img.icons8.com/?size=100&id=23243&format=png&color=000000"
            alt="image"
          />
        </div>
        <h1>Hi, {userData.username}</h1>
      </div>
      <div className="second-section">
        <button onClick={LogoutHandler}>Logout</button>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default Profile;
