import { useEffect, useState } from 'react';
import './message.css'
import {format} from 'timeago.js'
import axios from 'axios';

const Message = ({ own, message }) => {
    // console.log(message.sender)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
          try {
            const res = await axios.get("/users?userId=" + message?.sender)
            // console.log(res)
            setUser(res.data);
          } catch (err) {
            console.log(err);
          }
        }
        getUser();
      }, [message.sender])

    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <img src={user?.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} className='messageImg' alt="" />

                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}

export default Message
