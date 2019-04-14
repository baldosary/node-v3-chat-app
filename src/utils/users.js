const Users = [];
const Rooms = [];

//Add User:

const addUser = ({id, username, room}) => {

    //Clean data:
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate data:
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    //Check for existing:
    const existUser = Users.find((user) => {
        return user.room === room && user.username === username
    })
    if(existUser){
        return {
            error: 'username is in use!'
        }
    }
    const user = {id, username, room}
    Users.push(user);

    return { user };

}

//Removing a User:
const removeUser = (id) => {
    //Check if it exists:
    const index = Users.findIndex((user) => user.id === id);

    //Remove the user by its index:
    if(index !== -1){
        return Users.splice(index, 1)[0];
    }
}

//Get user by its id:
const getUser = (id) => {
    return Users.find((user) => user.id === id);
}

//Get all users in the specific room:
const getUsersRoom = (room) => {
    return Users.filter((user) => user.room === room);
}

const getAllUsers = () => {
    return Users;
}

//add room..
const addRoom = (roomName) => {
  const val = Rooms.length;
  const existRoom = Rooms.find((room) => {
      return room.roomName === roomName;
  })
  if(!existRoom) {
    const room = {val, roomName};
      Rooms.push(room);
  }
}
//get rooms..
const getRooms = () => {
    return Rooms;
}
const removeRoom = (roomName) => {
    const usersInRoom = getUsersRoom();
        const roomLength = usersInRoom.length;
        if(roomLength === 0){
           
            /*Delete the room:
             /1. Find the room
             /2. Delete the room
             */
             const index = Rooms.findIndex((room) => room.roomName === roomName);

            //Remove the user by its index:
            if(index !== -1){
             return Rooms.splice(index, 1);
            }
        }
  
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersRoom,
    getAllUsers,
    addRoom,
    getRooms,
    removeRoom
}