import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

let currentRoom = null

const socket = io({
    username : window.username,
    severOffset : 0,
    recovered : false
})
//This function logs out the user and erase the session cookie
function logout() {
    fetch('/api/user/logOut')
        .then((res) => {
            if (res.ok) {
                window.location.href = '/'
            }
        })
}

window.logout = logout

//show the favorites rooms of the user

document.addEventListener('DOMContentLoaded', () => {
    fetch(`/api/room/favoritesRooms/${window.userID}`)
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            
        })
        .then((data) => {
            if (data.length === 0) {
                document.getElementById('favorite-groups').innerHTML = '<h1>No favorites rooms</h1>'
            } else {
                data.forEach((room) => {
                    document.getElementById('favorite-groups').innerHTML += `
                    <div class="group-card" id="${room.id}" name="${room.name}">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <button class="delete-from-favorites" onclick="deleteFromFavorites('${room.id}')">X</button>
                        <button class="show-chat" onClick="showChatWindow('${room.id}')">Enter Group</button>
                    </div>`
                })
            }
        })
})


// this function show all the suggested rooms for the user

document.addEventListener('DOMContentLoaded', () => {
    fetch(`/api/room/suggestedRooms`)
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            console.log('error')
        })
        .then((rooms) => {
            if (rooms.length === 0) {
                document.getElementById('suggested-groups').innerHTML = '<h1>No suggested rooms</h1>'
            } else {
                rooms.forEach((room) => {
                    document.getElementById('suggested-groups').innerHTML += `
                    <div class="group-card" id="${room.id}" name="${room.name}">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <button class="add-to-favorites" onclick="addToFavorites('${room.id}')">Add</button>
                        <button class="show-chat" onClick="showChatWindow('${room.id}')">Enter Group</button>
                    </div>`
                })
            }
        })
})

// Allow pressing enter to send a message

document.getElementById('messageInput').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        sendMessage({ message: event.target.value, username: window.username })
    }
})

//This function close the chat window
export function closeChatWindow() {
    document.getElementById('chatWindow').style.display = 'none';
    document.querySelector('main').classList.remove('blur-background')
    document.querySelector('header').classList.remove('blur-background')
}

window.closeChatWindow = closeChatWindow

//This function show the chat window

function showChatWindow(roomID) {

    currentRoom = roomID

    fetch(`/api/room/getMessages/${roomID}`)
        .then((res) => { 
            if (res.ok) {
                return res.json()
            }
        })
        .then((messages) => {
            document.querySelector('.room-name').innerHTML = document.getElementById(roomID).getAttribute('name')
            document.getElementById('chatMessages').innerHTML = ''
            messages.forEach((message) => {
                printMessage({ message: message.content, username: message.username })
            })
            socket.emit('joinRoom', roomID)
        })
        .catch((err) => {
            console.log(err)
        })
    setTimeout(() => {
        document.getElementById('chatWindow').style.display = 'flex'
        document.querySelector('main').classList.add('blur-background')
        document.querySelector('header').classList.add('blur-background')
    }, 250)
    
}

window.showChatWindow = showChatWindow

function sendMessage({ message, username }) {
    
    message = document.getElementById('messageInput').value

    if (message.trim() !== '') {

        socket.emit('message', { message, username, room: currentRoom })  
        document.getElementById('messageInput').value = ''
        document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight

    }
}

window.sendMessage = sendMessage

function receiveMessage({ message, username }) {
    
}

window.receiveMessage = receiveMessage

function printMessage({ message, username }) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    
    if (username === window.username) {
        messageElement.classList.add('message', 'user');
    } else {
        messageElement.classList.add('message', 'other');
    }

    const messageContent = document.createElement('div');
    messageContent.textContent = message;

    const messageUsername = document.createElement('div');
    messageUsername.textContent = username;
    messageUsername.classList.add('username');

    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageUsername);
    chatMessages.appendChild(messageElement);
}

window.printMessage = printMessage

//This function adds a new room to the favorites of the user

function addToFavorites(roomID) {
    fetch(`/api/room/addFavorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: window.userID, roomID })
    })
        .then((res) => {
            if (res.ok) {
                document.getElementById(roomID).remove()
                return res.json()
            }else if(res.status === 400){
                return res.json().then((data) => {
                    alert(data.message)
                })
            }
        })
        .then((room) => {
            console.log(room)
            document.getElementById('favorite-groups').innerHTML += `
            <div class="group-card" id="${room.id}" name="${room.name}">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <button class="delete-from-favorites" onclick="deleteFromFavorites('${room.id}')">X</button>
                        <button class="show-chat" onClick="showChatWindow('${room.id}')">Enter Group</button>
                    </div>
            `
        })
        .catch((err) => {
            console.log(err)
        })
}

window.addToFavorites = addToFavorites

//This function deletes a room from the favorites of the user

function deleteFromFavorites(roomID) {
    fetch(`/api/room/deleteFavorite`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID : window.userID, roomID })
    })
        .then((res) => {
            if (res.ok) {
                document.getElementById(roomID).remove()
                return res.json()
            }else if(res.status === 400){
                return res.json().then((data) => {
                    alert(data.message)
                })
            }
        })
        .then((room) => {
            console.log(room)
            document.getElementById('suggested-groups').innerHTML += `
            
            <div class="group-card" id="${room.id}" name="${room.name}">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <button class="add-to-favorites" onclick="addToFavorites('${room.id}')">Add</button>
                <button class="show-chat" onClick="showChatWindow('${room.id}')">Enter Group</button>
            </div>
        `
        })
        .catch((err) => {
            console.log(err)
        })
}

window.deleteFromFavorites = deleteFromFavorites


//Websockets

socket.on('message', (msg) => {
    printMessage({ message: msg.message, username: msg.username })
})