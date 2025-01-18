const logInButton = document.querySelector('#logInButton')


//log the user
logInButton.addEventListener('click', (e) => {
    e.preventDefault()

    const username = document.getElementById('usernameLogIn').value
    const password = document.getElementById('passwordLogIn').value
    
    login(username,password)
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