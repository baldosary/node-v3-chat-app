const path = require('path')
const express = require('express')
const socketio = require('socket.io');
const http = require('http');
const Filter = require('bad-words');

const app = express()
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { addUser, removeUser, getUser, getUsersRoom, addRoom, getRooms, removeRoom} = require('./utils/users');
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const filter = new Filter();

io.on('connection', (socket) => {
    console.log('New socket connection');
    //Emit the rooms to the new connected user:
    io.emit('rooms', getRooms());
    //Listen to join event 
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id: socket.id, username, room});
        if(error) {
          return callback(error);
        }
        //Add the room to the Rooms list
        addRoom(user.room);

        socket.join(user.room)
        
        socket.emit('message',  generateMessage('Admin', `welcome!, ${user.username}`));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersRoom(user.room)
        })
        callback();
    })

    
    
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        if(filter.isProfane(message)) {
            return callback('Profanity isn\'t allowed!');
        }

        if(user) {
            io.to(user.room).emit('message', generateMessage(user.username, message));
        }
        callback();
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id);
        
        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
            removeRoom(user.room);

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersRoom(user.room)
            })
        }  
       
        
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback();
    })
})


app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})