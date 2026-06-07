
import { Link, Outlet } from "react-router-dom";
import profilepic from "../assets/user.png";
import { ShoppingCart } from 'lucide-react'
import Appimage from '../../public/storage-app.png'

const HomeLayout = () => {
  return (
    <div>
      <div className="nav-bar">
        <div className="text-xl font-bold flex items-center gap-2">

          <img src={Appimage} height={40} width={40} alt="app-image" />

          <span>My Drive</span>
        </div>
        <div className="flex gap-6 items-center justify-center">
          <Link className="service-btn" to={'/services'}>
            <ShoppingCart size={20} color="white" />
            <span className="text-sm text-white italic">Subscription</span>
          </Link>
          <Link to="/profile" className="profile-wrapper">
            <div className="profile-imgcontainer">
              <img src={profilepic} alt="image" title="profile" />
            </div>
          </Link>
        </div>

      </div>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
