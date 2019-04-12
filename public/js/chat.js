
const socket = io();

//Elements...
const $messageForm = document.querySelector('#message-form');
const $formInput = document.querySelector('input');
const $formButton = document.querySelector('button');
const $sendButton = document.querySelector('#send-location');
const $message = document.querySelector('#messages');
const $roomSidebar = document.querySelector('#room-sidebar');

//Templates...
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;
const roomDataTemplate = document.querySelector('#sidebar-template').innerHTML;

//UserName and Password:
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $message.offsetHeight

    // Height of messages container
    const containerHeight = $message.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, { 
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a') 
    });

    $message.insertAdjacentHTML('beforeend', html);
    autoscroll();
})
socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    $message.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Disable the button:
    $formButton.setAttribute('disabled', 'disabled');

    const message = $formInput.value;

    socket.emit('sendMessage', message, (error) => {
        //Enable the button:
        $formButton.removeAttribute('disabled');
        $formInput.value = '';
        $formInput.focus();
         if(error) {
             return console.log(error);
         }
         console.log('The message has been delivered!');


    });
})

$sendButton.addEventListener('click', () => {


    if(!navigator.geolocation){
        return alert('Geolocation isn\'t supported by your browser!');
    }


    //disable the button 
    $sendButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((positon) => {
        socket.emit('sendLocation', {
           latitude: positon.coords.latitude,
           longitude: positon.coords.longitude
        }, () => {
            $sendButton.removeAttribute('disabled');
            console.log('Location Shared!');
            
        })
    })
})
socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(roomDataTemplate, {
        room,
        users
    })
    $roomSidebar.innerHTML = html;
    

})
socket.emit('join', {username, room }, (error) => {
    if(error){
      alert(error);
      location.href = '/';
    }   
});