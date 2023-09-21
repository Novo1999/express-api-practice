const allMusicsContainer = document.querySelector('.my-musics')

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
  const currentUserToken = localStorage.getItem('currentUserToken')
  try {
    const response = await fetch('api/v1/musics', {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${currentUserToken}`,
      },
    })
    const data = await response.json()
    const musics = data.musics
      .map(music => {
        return `<div
         class="music rounded-lg bg-slate-400 shadow-lg p-4 break-all overflow-x-auto" style="margin-bottom: 16px"
       >
         <div class="flex justify-between">
           <p class="text-3xl font-serif">${music.track}</p>
           <div class="flex w-48 gap-8">
           <button >
           <img class="w-12 h-12" src="./pen.png" alt="edit">
          </button>
          <button >
           <img class="w-12 h-12" src="./remove.png" alt="edit">
          </button>
           </div>
         </div>
         <p class="text-xl">Artist: ${music.artist}</p>
         <p class="text-lg">Added: ${formatDate(music.createdAt)}</p>
       </div>`
      })
      .join('')
    console.log(musics)
    allMusicsContainer.innerHTML = musics
  } catch (error) {
    console.log(error)
  }
}

getAllMusics()
