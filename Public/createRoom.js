document.getElementById('backButton').addEventListener('click', (e) => {
    
    e.preventDefault()
    window.location.href = '/'

})


document.getElementById('createRoomForm').addEventListener('submit', (e) => {
    e.preventDefault()

    const roomName = document.getElementById('roomName').value
    const roomDescription = document.getElementById('roomDescription').value

    fetch('/api/room/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: roomName, description: roomDescription })
    })
        .then((res) => {
            if (res.ok) {
            alert('The room was created successfully')
        }
    })
})