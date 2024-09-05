import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Add, Remove } from '@material-ui/icons';

export default function Rightbar({ user }) {

  //Access the Public folder 
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  //console.log(currentUser)
  const currentUserId = currentUser?._id; // Current logged-in user's ID
  const [followed, setFollowed] = useState(false);

  // Set followed state based on current user followings
  useEffect(() => {
      if (currentUser && user) {
          setFollowed(currentUser.followings.includes(user._id));
      }
  }, [currentUser, user]);


  const getFriends = async () => {
    try {
      // console.log(user._id)
      const res = await axios.get('/users/friends/' + user._id);
      setFriends(res.data)
      // console.log(res.data)
    } catch (e) {
      // console.log("Failed to get friends", e);
    }
  }
  useEffect(() => {
    getFriends();
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = async () => {
    try {
        if (followed) {
            // Unfollow user
            await axios.put(`/users/${user._id}/follow`, { userId: currentUserId });
            dispatch({ type: "UNFOLLOW", payload: { userId: user._id, currentUserId: currentUserId } });
            setFollowed(false); // Update state to reflect unfollow
        } else {
            // Follow user
            await axios.put(`/users/${user._id}/follow`, { userId: currentUserId });
            dispatch({ type: "FOLLOW", payload: { userId: user._id, currentUserId: currentUserId} });
            setFollowed(true); // Update state to reflect follow
        }
    } catch (e) {
        console.error("Error in follow/unfollow", e);
    }
};




  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={`${PF}gift.png`} alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img className="rightbarAd" src={`${PF}ad.png`} alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends && friends.map(friend =>
          (
            <div className="rightbarFollowing" key={friend._id}>
              <Link to={"/profile/" + friend.username}>
                <img
                  src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"}
                  alt=""
                  className="rightbarFollowingImg"
                />
              </Link>
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
          )
          )}

        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
