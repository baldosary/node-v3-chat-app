const Users = [];

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
    
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersRoom
}