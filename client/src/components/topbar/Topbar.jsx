import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';



export default function Topbar() {
  let naviagte = useNavigate();
  const logoutClick =async ()=>{
    dispatch({ type: 'LOGOUT' });
    naviagte('/login');
  }
  const { user, dispatch } = useContext(AuthContext)
  //console.log(user) //In backend user data is stored in Object
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to='/' style={{ textDecoration: "none" }}><span className="logo">SocialApp</span></Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
          <Link to='/messenger' style={{ textDecoration: "none",color:"white" ,cursor:"pointer"}}><Chat /></Link>
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <><Link to={`/profile/${user.username}`}>
          <img src={
            user.profilePicture
              ? PF + user.profilePicture :
              PF + "person/noAvatar.png"} alt="" className="topbarImg" />
        </Link>
          <span onClick={() => logoutClick()} style={{cursor:"pointer"}}><ExitToAppSharpIcon /></span>
        </>
      </div>
    </div>
  );
}
