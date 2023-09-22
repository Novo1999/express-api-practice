const allMusicsContainer = document.querySelector('.my-musics')
const addMusicBtn = document.querySelector('.add-music')
const currentUserToken = localStorage.getItem('currentUserToken')
const addNewForm = document.querySelector('.form')

const submit = document.querySelector('.submit')

const trackInput = document.querySelector('.track')
const artistInput = document.querySelector('.artist')

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
        const { track, artist, createdAt, id } = music
        return `<div
         class="music rounded-lg bg-slate-400 shadow-lg p-4 break-all overflow-x-auto" style="margin-bottom: 16px"
       >
         <div class="flex justify-between">
           <p class="text-3xl font-serif">${track}</p>
           <div class="flex w-48 gap-8">
           <button >
           <img class="w-12 h-12" src="./pen.png" alt="edit">
          </button>
          <button >
           <img class="w-12 h-12" src="./remove.png" alt="edit">
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

async function addMusic(
  data = { track: trackInput.value, artist: artistInput.value }
) {
  try {
    const response = await fetch('/api/v1/musics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUserToken}`,
      },
      body: JSON.stringify(data),
    })
    await response.json()
    getAllMusics()
  } catch (error) {
    alert(error)
  }
}

addMusicBtn.addEventListener('click', () => {
  addNewForm.classList.toggle('hidden')
})

submit.addEventListener('click', e => {
  e.preventDefault()
  addMusic()
  addNewForm.classList.add('hidden')
})
