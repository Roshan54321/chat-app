const socket = io('http://localhost:8000', { transports: ['websocket', 'polling', 'flashsocket'] });
let audio = new Audio('messagetone.mp3')
let audio1 = new Audio('messagetone1.mp3')

const form = document.getElementById('send__container');
const messageInput = document.getElementById('send__container__message')
const messageContainer = document.querySelector('.messagearea')
const add = (message, position) => {
    const messageElement =  document.createElement('div')  
    messageElement.innerHTML = message 
    messageElement.classList.add('container__message')     
    messageElement.classList.add(position)  
    if(position == 'container__left')
    {
        audio.play();
    }

    if(position == 'container__middle')
    {
        audio1.play();
    }
    messageContainer.append(messageElement)

}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value;
    add(`You: ${message}`, 'container__right');
    socket.emit('send', message);
    messageInput.value = '';
})

const namee = prompt('Enter your name to join:')
if(namee){
    socket.emit('new-user-joined', namee)
}

socket.on('user-joined', name => {
    add(`${name} joined the chat`, 'container__middle')
})

socket.on('receive', data => {
    add(`${data.name}: ${data.message}`, 'container__left')
})

socket.on('left', data => {
    if(data){
        add(`${data} left the chat`, 'container__middle')
    }
})