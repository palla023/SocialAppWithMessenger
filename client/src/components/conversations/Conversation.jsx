import { useContext, useEffect, useState } from 'react';
import './conversation.css'
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Conversation = ({ conversation }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  // console.log(user)
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const friendId = conversation.members.find(member => member !== currentUser._id) //[members]=> one is loggedId,another one is friendId
    const getUser = async () => {
      try {
        const res = await axios.get("/users?userId=" + friendId)
        // console.log(res)
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getUser();
  }, [currentUser, conversation])

  return (
    <div className='conversation'>
      <img src={user?.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} className='conversationImage' alt="" />
      <span className="conversationName">{user?.username}</span>
    </div>
  )
}

export default Conversation
