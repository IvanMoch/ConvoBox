

document.getElementById('profileForm').addEventListener('submit', (e) => {

    e.preventDefault()

    fetch('/api/user/modify', {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            description: document.getElementById('description').value
        })
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            return alert('Error while fetching')
        })
        .then((result) => {
            return alert(result.message)
    })

    disableForm()
})


function enableForm() {

    document.getElementById('username').disabled = false
    document.getElementById('email').disabled = false
    document.getElementById('description').disabled = false
    document.getElementById('saveButton').disabled = false
    document.getElementById('saveButton').className = 'enabled'

}

function disableForm() {

    document.getElementById('username').disabled = true
    document.getElementById('email').disabled = true
    document.getElementById('description').disabled = true
    document.getElementById('saveButton').disabled = true
    document.getElementById('saveButton').className = ''

}