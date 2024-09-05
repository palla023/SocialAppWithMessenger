import React, { useContext, useEffect, useRef, useState } from 'react';
import Topbar from '../topbar/Topbar';
import './messenger.css'
import Conversation from '../conversations/Conversation';
import Message from '../message/Message';
import ChatOnline from '../chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from "socket.io-client";

const Messenger = () => {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef();
    const socket = useRef();
    const { user } = useContext(AuthContext);


    // console.log(user)
    // when a user loggedin , it will connect to a server only one time
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    //If there is any change in the arrival messages we gonna update the messages
    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);


    // console.log(onlineUsers);

    useEffect(() => {
        socket.current.emit("addUser", user._id); //ref.current.value
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
                //check the user followings with the Socket users connected List 
                user.followings.filter((f) => users.some((u) => u.userId === f))
            );
        });
    }, [user]);
    console.log(onlineUsers);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id);
                setMessages(res.data);
            } catch (err) { console.log(err) }
        }
        getMessages();
    }, [currentChat])
    // console.log(messages);
    // console.log(currentChat)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };
        //find the recever-> other than the current logged in user in members array 
        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );
        //send the data to Server
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");

        } catch (err) { console.log(err) }
    }



    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])
    return (
        <>
            <Topbar />
            <div className='messenger'>
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" className="chatMenuInput" placeholder='Search for Friends' />
                        {conversations.map((conversation, i) => (
                            <div key={i} onClick={() => setCurrentChat(conversation)}>
                                <Conversation conversation={conversation} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                (<>
                                    <div className="chatBoxTop">
                                        {messages.map((m, index) => (
                                            <div key={index} ref={scrollRef}>
                                                <Message message={m} own={m.sender === user._id} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea
                                            className='chatMessageInput'
                                            placeholder='Please enter your Text Message'
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        >
                                        </textarea>
                                        <button
                                            className="chatSubmitButton"
                                            onClick={handleSubmit}
                                        >Send</button>
                                    </div>
                                </>) : (<span className='noConversationText'>Open a Conversation to start a Chat</span>)}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger
