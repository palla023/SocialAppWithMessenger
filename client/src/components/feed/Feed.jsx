import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
// import { Posts } from "../../dummyData";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useContext } from "react";
// import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  // console.log(username);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchposts = async () => {
      const res = username
        ? await axios.get('/posts/profile/' + username)
        : await axios.get('/posts/timeline/' + user._id);
      // Sorting the Data , that will get our uploaded posts at the top of the Page
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }

        )
      )
    }
    fetchposts();
  }, [username, user._id]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* In Home Component Username not exists, So first condition matches ,so it renders Share Component
            In Profile Page Username exits , so it will compare the user name with user.username  */}
       {(!username ||  username === user.username) && <Share />}
        {posts && posts.length > 0 && posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
