const logInButton = document.querySelector('#logInButton')
const signUpButton = document.querySelector('#signUpButton')


//log the user
logInButton.addEventListener('click', (e) => {
    e.preventDefault()

    const username = document.getElementById('usernameLogIn').value
    const password = document.getElementById('passwordLogIn').value
    
    login(username,password)
})

//create a new user

signUpButton.addEventListener('click', (e) => {
    e.preventDefault()

    const username = document.getElementById('usernameSignUp').value
    const password = document.getElementById('passwordSignUp').value
    const email = document.getElementById('emailSignUp').value

    fetch('/api/user/signUp', {
        method: 'POST',
        headers:{
            'content-type' : 'application/json'
        },
        body: JSON.stringify({username, password, email})
    })
        .then((res) => {
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
                window.location.href = `/main`
            }
            return console.log('Error while fetching')
        })
        
}