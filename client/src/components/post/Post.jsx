import "./post.css";
import { MoreVert } from "@material-ui/icons";
import axios from "axios";
// import { Users } from "../../dummyData";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from 'timeago.js'
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState({});

  //Access the Pubile folder 
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  //If we like another post after dislikng the current Post , it will give response as disliked
  //to overcome that one , we can set the condition like ,in Post Likes userId is included or not
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id)) // if post likes included the CurrentUserId , it will be true means liked1
  }, [currentUser._id, post.likes]);

  const likeHandler =async () => {
    try {
      await axios.put('/posts/' + post._id + '/like', { userId: currentUser._id })
    } catch (err) { }
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  /*
  const matchingUser = user && user.find((u) => u.id === post?.userId);
  const profilePicture = matchingUser ? matchingUser.profilePicture : null;
  const username = matchingUser ? matchingUser.username : null;
  */

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`) //Passing by Query method
      // console.log(res.data);
      setUser(res.data)
      // console.log(res.data)
    }
    fetchUsers();
  }, [post.userId]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
                alt=""
              />
            </Link>
            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
