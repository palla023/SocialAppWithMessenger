const io = require("socket.io")(8900, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

let users = [];
//function to remove the duplicate userId & SocketId
const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

//need to find specific user to send the text
const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

// Listening for client connections
io.on('connection', (socket) => {
    //Connect
    console.log('A user connected:', socket.id);
    //after every connection take userId and socketId from user <-user needs to send userId from the client
    socket.on('addUser', userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users)
    })

    //Send & get Message
    //take event from the client and send to specific client
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        //need to find specific user to send the text
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
          });

    })

    // Disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        //if user closed the browser , remove the user from the users collection
        removeUser(socket.id);
        //after removing the disconnected user , send the connected users to the Client
        io.emit("getUsers", users);
    });
});