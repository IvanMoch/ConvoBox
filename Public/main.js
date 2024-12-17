
//This function logs out the user and erase the session cookie
function logout() {
    fetch('/api/user/logOut')
        .then((res) => {
            if (res.ok) {
                window.location.href = '/'
            }
        })
}