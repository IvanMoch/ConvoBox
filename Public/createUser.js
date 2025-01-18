//create a new user

document.getElementById('createUserForm').addEventListener('submit', (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const email = document.getElementById('email').value
    const profilePicture = document.getElementById('profilePicture').files[0]

    const formData = new FormData()

    console.log(profilePicture)

    formData.append('profilePicture', profilePicture)
    formData.append('username', username)
    formData.append('password', password)
    formData.append('email', email)


    fetch('/api/user/signUp', {
        method: 'POST',
        body: formData

    }).then((res) => {
            if (res.ok) {
            login(username,password)
            }
            return console.log('error while fetching')
        })
})

function login(username, password){
    fetch('/api/user/logIn', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
        .then((res) => {
            if (res.ok) {
                return window.location.href = `/main`
            }
            alert('Username or password is incorrect')
        })
        
}