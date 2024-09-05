import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {

  //Access the Public folder 
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  let params = useParams();
  //console.log(params)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/users?username=${params.username}`) //Passing by Query method
      // console.log(res.data);
      setUser(res.data)
     // console.log(res.data)
    }
    fetchUsers();
  }, [params.username]); //Give the dependecy , because when we click on user's friend, params is changing to his name

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture ? PF + user.coverPicture : PF+"person/noCover.png"}
                alt=""
              />
              <img
                className="profileUserImg"
                src={user.profilePicture? PF + user.profilePicture : PF+"person/noAvatar.png"}
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={params.username} user = {user}/>
            <Rightbar user = {user}/>
          </div>
        </div>
      </div>
    </>
  );
}
