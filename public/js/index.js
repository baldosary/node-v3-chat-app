const socket = io();

//Elements...
const $selectElement = document.querySelector('#room-select');

//templates...
const selectOptionsTemplate = document.querySelector('#room-template').innerHTML;

socket.on('rooms', (rooms) => {
    console.log(rooms);
    const html = Mustache.render(selectOptionsTemplate, rooms);
    $selectElement.insertAdjacentHTML('beforeend', html);
})

