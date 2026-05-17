
import { Link, Outlet } from "react-router-dom";


const HomeLayout = () => {
  return (
    <div>
      <div className="nav-bar">
        <h2>My Drive</h2>
        <Link className="service-btn" to={'/services'}>Services</Link>
      </div>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
