
//This function logs out the user and erase the session cookie
function logout() {
    fetch('/api/user/logOut')
        .then((res) => {
            if (res.ok) {
                window.location.href = '/'
            }
        })
}

//show the favorites rooms of the user

document.addEventListener('DOMContentLoaded', () => {
    fetch(`/api/room/favoritesRooms/${userID}`)
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
                        <button class="show-chat" onClick="showChatWindow()">Enter Group</button>
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
                        <button class="show-chat" onClick="showChatWindow()">Enter Group</button>
                    </div>`
                })
            }
        })
})

//This function close the chat window
function closeChatWindow() {
    document.getElementById('chatWindow').style.display = 'none';
    document.querySelector('main').classList.remove('blur-background')
    document.querySelector('header').classList.remove('blur-background')
}

//This function show the chat window

function showChatWindow() {
    document.getElementById('chatWindow').style.display = 'flex'
    document.querySelector('main').classList.add('blur-background')
    document.querySelector('header').classList.add('blur-background')
}

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  if (message.trim() !== '') {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message', 'user');
    chatMessages.appendChild(messageElement);
    messageInput.value = '';
  }
}


function receiveMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('message', 'other');
  chatMessages.appendChild(messageElement);
}



//This function adds a new room to the favorites of the user

function addToFavorites(roomID) {
    fetch(`/api/room/addFavorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID, roomID })
    })
        .then((res) => {
            if (res.ok) {
                return document.getElementById('favorite-groups').appendChild(document.getElementById(roomID))
            }else if(res.status === 400){
                return res.json().then((data) => {
                    alert(data.message)
                })
            }
        })
        .catch((err) => {
            alert(err)
        })
}