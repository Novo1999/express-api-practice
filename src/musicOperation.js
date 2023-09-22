const allMusicsContainer = document.querySelector('.my-musics')
const addMusicBtn = document.querySelector('.add-music')
const currentUserToken = localStorage.getItem('currentUserToken')
const currentUserName = localStorage.getItem('name')
const form = document.querySelector('.form')
const welcomeUser = document.querySelector('.welcome')

welcomeUser.innerText = `Welcome, ${currentUserName}`

const notification = document.querySelector('.notification')

// format Date
function formatDate(inputDate) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(inputDate).toLocaleDateString('en-US', options)
}

async function getAllMusics() {
  try {
    const response = await fetch('api/v1/musics', {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    })
    const data = await response.json()

    const musics = data.musics
      ?.map(music => {
        const { track, artist, createdAt, _id: musicId } = music

        return `<div
         class="music rounded-lg bg-slate-400 shadow-lg p-4 break-all overflow-x-auto" style="margin-bottom: 16px"
       >
         <div class="flex justify-between">
           <p class="text-3xl font-serif">${track}</p>
           <div class="flex w-48 gap-8">
           <button>
           <img data-id=${musicId} class="w-12 h-12 edit" src="./pen.png" alt="edit">
          </button>
          <button>
           <img data-id=${musicId} class="w-12 h-12 delete" src="./remove.png" alt="edit">
          </button>
           </div>
         </div>
         <p class="text-xl">Artist: ${artist}</p>
         <p class="text-lg">Added: ${formatDate(createdAt)}</p>
       </div>`
      })
      .join('')

    if (data.msg) {
      allMusicsContainer.innerHTML = `<p class="text-5xl">${data.msg}</p>`
    } else {
      allMusicsContainer.innerHTML = musics
    }
  } catch (error) {
    console.log(error)
  }
}

getAllMusics()

async function addMusic(value1, value2) {
  try {
    const response = await fetch('/api/v1/musics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUserToken}`,
      },
      body: JSON.stringify({ track: value1, artist: value2 }),
    })
    await response.json()
    getAllMusics()
  } catch (error) {
    alert(error)
  }
}

addMusicBtn.addEventListener('click', e => {
  form.innerHTML = `<div class="flex gap-4 flex-col">
  <label for="track">Track</label>
  <input class="p-4 track" type="text" name="track" placeholder="track" />
  </div>
  <div class="flex gap-4 flex-col">
  <label for="artist">Artist</label>
  <input
    class="p-4 artist"
    type="text"
    name="artist"
    placeholder="artist"
  />
  </div>
  <button
  type="submit"
  class="submit"
  style="
    background-color: white;
    padding: 10px 40px 10px 40px;
    border-radius: 5px;
  "
  >
  Add
  </button>
  <button
  type="button"
  class="close"
  style="
    background-color: white;
    padding: 10px 40px 10px 40px;
    border-radius: 5px;
  "
>
  Close
</button>`
  form.classList.remove('hidden')

  const trackInput = document.querySelector('.track')
  const artistInput = document.querySelector('.artist')

  const submit = document.querySelector('.submit')
  submit.addEventListener('click', e => {
    e.preventDefault()
    addMusic(trackInput.value, artistInput.value)
    trackInput.value = ''
    artistInput.value = ''
    form.classList.add('hidden')
  })
})

let notificationTimeoutId

async function deleteMusic(id) {
  try {
    const response = await fetch(`/api/v1/musics/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    })
    const deletedMusic = await response.json()
    notification.innerHTML = deletedMusic.msg
    notificationTimeoutId = setTimeout(() => {
      notification.innerHTML = ''
    }, 1000)
  } catch (error) {
    alert("Sorry.Couldn't delete music")
  }
}

// delete the music with event delegation
allMusicsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    deleteMusic(e.target.dataset.id)
    getAllMusics()
    clearTimeout(notificationTimeoutId)
  }
  if (e.target.classList.contains('edit')) {
    const currentSelectedId = e.target.dataset.id
    const selectedMusicPromise = getSingleMusic(currentSelectedId)

    form.innerHTML = `<div class="flex gap-4 flex-col">
    <label for="track">Track</label>
    <input class="p-4 edit-track" type="text" name="track" placeholder="track" />
    </div>
    <div class="flex gap-4 flex-col">
    <label for="artist">Artist</label>
    <input
      class="p-4 edit-artist"
      type="text"
      name="artist"
      placeholder="artist"
    />
    </div>
    <button
    type="submit"
    class="edit"
    style="
      background-color: white;
      padding: 10px 40px 10px 40px;
      border-radius: 5px;
    "
    >
    Edit
    </button> 
    <button
    type="button"
    class="close"
    style="
      background-color: white;
      padding: 10px 40px 10px 40px;
      border-radius: 5px;
    "
  >
    Close
  </button>`
    form.classList.remove('hidden')

    const trackInput = document.querySelector('.edit-track')
    const artistInput = document.querySelector('.edit-artist')
    const editBtn = document.querySelector('.edit')
    // getting data of the selected music and placing in the input
    Promise.resolve(selectedMusicPromise).then(selected => {
      trackInput.value = selected.music?.track
      artistInput.value = selected.music?.artist
    })
    // editing
    editBtn.addEventListener('click', e => {
      e.preventDefault()
      editMusic(currentSelectedId, trackInput.value, artistInput.value)
      form.classList.add('hidden')
    })
  }
})

// Getting single musics values to set up the update functionality
async function getSingleMusic(id) {
  try {
    const response = await fetch(`api/v1/musics/${id}`, {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    alert('Data unavailable')
  }
}

async function editMusic(id, edit1, edit2) {
  try {
    await fetch(`/api/v1/musics/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${currentUserToken}`,
      },
      body: JSON.stringify({
        track: edit1,
        artist: edit2,
      }),
    })
    getAllMusics()
  } catch (error) {
    alert("Couldn't edit music")
  }
}

// close the form using the close button
form.addEventListener('click', e => {
  if (e.target.classList.contains('close')) {
    form.classList.add('hidden')
  }
})
