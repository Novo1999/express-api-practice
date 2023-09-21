const formName = document.querySelector('.form-name')
const registrationForm = document.querySelector('.registration-form')
const loginForm = document.querySelector('.log-in-form')
const registerLogin = document.querySelectorAll('.register-login')

const usernameInput = document.querySelector('.username')
const regEmailInput = document.querySelector('.register-email')
const regPasswordInput = document.querySelector('.register-password')

const loginEmailInput = document.querySelector('.login-email')
const loginPasswordInput = document.querySelector('.login-password')

const loginSubmit = document.querySelector('.login-submit')
const registerSubmit = document.querySelector('.register-submit')

const notification = document.querySelector('.notification')

const homepage = document.querySelector('.home')
const authSection = document.querySelector('.auth-section')

const alreadyLoggedIn = document.querySelector('.already-logged-in')

const logOutBtn = document.querySelector('.log-out')

// Check if user is currently logged in
function isCurrentlyLoggedIn() {
  if (localStorage.getItem('currentUserToken')) {
    authSection.classList.add('hidden')
    alreadyLoggedIn.classList.remove('hidden')
  } else {
    authSection.classList.remove('hidden')
    alreadyLoggedIn.classList.add('hidden')
  }
}

isCurrentlyLoggedIn()

function logOut() {
  localStorage.removeItem('currentUserToken')
  isCurrentlyLoggedIn()
}

logOutBtn.addEventListener('click', logOut)

// Register and log in form logic
registerLogin.forEach(btn =>
  btn.addEventListener('click', () => {
    if (btn.innerText === 'Log in now') {
      formName.innerText = 'Log in'
      loginForm.classList.add('block')
      loginForm.classList.remove('hidden')
      registrationForm.classList.add('hidden')
    }
    if (btn.innerText === 'Register now') {
      formName.innerText = 'Register'
      registrationForm.classList.add('block')
      registrationForm.classList.remove('hidden')
      loginForm.classList.add('hidden')
    }
  })
)

let notificationTimeoutId

// Login the user
async function login(
  data = {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  }
) {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const user = await response.json()
    // setting notification
    notification.innerText = user.msg
    notificationTimeoutId = setTimeout(() => {
      notification.innerText = ''
    }, 1500)
    // redirect after user logs in
    if (user.token) {
      window.location.href = 'music-page.html'
    }
    localStorage.setItem('currentUserToken', user.token)
  } catch (error) {
    console.log(error)
  }
}
loginSubmit.addEventListener('click', e => {
  e.preventDefault()
  login()
  clearTimeout(notificationTimeoutId)
})

// Register the user
async function register(
  data = {
    name: usernameInput.value,
    email: regEmailInput.value,
    password: regPasswordInput.value,
  }
) {
  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const user = await response.json()
    console.log(user)
    // setting notification
    notification.innerText = user.msg.startsWith('User')
      ? user.msg.split(':')[2]
      : user.msg
    notificationTimeoutId = setTimeout(() => {
      notification.innerText = ''
    }, 1500)
  } catch (error) {
    console.log(error)
  }
}

registerSubmit.addEventListener('click', e => {
  e.preventDefault()
  register()
  clearTimeout(notificationTimeoutId)
})

// Get musics data associated with the user
