
console.log(userID)

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
                    <div class="group-card" id="${userID}">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <button>Enter Group</button>
                    </div>`
                })
            }
        })
})
        