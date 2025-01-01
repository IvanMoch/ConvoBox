
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
                    <div class="group-card" id="${room.id}" name="${room.name}" onClick="showChatWindow()">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <button>Enter Group</button>
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
                    <div class="group-card" id="${room.id}" name="${room.name}" onClick="showChatWindow()">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <button>Enter Group</button>
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