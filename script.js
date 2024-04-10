console.log('javascript ->')
let currSong = new Audio()
let songs;
let currFolder;

function sectomin(totalSeconds) {
    var integerSeconds = Math.floor(totalSeconds);
    var decimalSeconds = totalSeconds - integerSeconds;

    var minutes = Math.floor(integerSeconds / 60);
    var remainingSeconds = integerSeconds % 60;

    var additionalSeconds = Math.round(decimalSeconds * 100) / 100;
    remainingSeconds += additionalSeconds;

    var formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? "0" : "") + Math.floor(remainingSeconds);
    var formattedTime = formattedMinutes + ":" + formattedSeconds;

    return formattedTime;
}


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let aS = div.getElementsByTagName('a')
    songs = []

    for (let index = 0; index < aS.length; index++) {
        const element = aS[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songList = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songList.innerHTML = ' '
    for (const song of songs) {
        songList.innerHTML = songList.innerHTML +
            `<li>
        <img src="/images/music.svg" alt="music">
        <div class="songname">
            <div>${song.replaceAll('%20', ' ')}</div>
        </div>
        <div class="playbtn">
            <img src="/images/play-song.svg" alt="play">
        </div>
        </li>`
    }

    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach((e) => {
        e.addEventListener('click', (element) => {
            console.log(e.querySelector('.songname').firstElementChild.innerHTML)
            playsong(e.querySelector('.songname').firstElementChild.innerHTML)
        })
    })

    return songs

}

const playsong = (song) => {
    currSong.src = `/${currFolder}/${song}`
    currSong.play()
    play.src = '/images/pause.svg'
    document.querySelector('.info').innerHTML = song.replaceAll('%20', ' ')
    document.querySelector('.time').innerHTML = '00:00 / 00:00'

}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let albumContainer = document.querySelector('.albumContainer')
    let link = div.getElementsByTagName('a')
    let array = Array.from(link)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if (e.href.includes('/songs') && !e.href.includes('.htaccess')) {
            let folder = e.href.split('/').slice(-2)[0]

            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            albumContainer.innerHTML += `<div data-folder="${folder}" class="album">
            <div class="play">
                <img src="/images/play-black.svg">
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="Nostalgic 90s Bollywood Beats" />
            <h3>${response.title}</h3>
            <p>
                ${response.desc}
            </p>
        </div>`
        }
    }

    Array.from(document.getElementsByClassName('album')).forEach((e) => {
        e.addEventListener('click', async (elm) => {
            songs = await getSongs(`songs/${elm.currentTarget.dataset.folder}`)
            playsong(songs[0])
        })
    })
}

async function main() {

    await getSongs(`songs/bollywood-90s`)

    displayAlbums()

    play.addEventListener('click', () => {
        if (currSong.paused) {
            currSong.play()
            play.src = '/images/pause.svg'
        }
        else {
            currSong.pause()
            play.src = '/images/play-song.svg'
        }
    })

    currSong.addEventListener('timeupdate', () => {
        document.querySelector('.time').innerHTML = `${sectomin(currSong.currentTime)}/${sectomin(currSong.duration)}`
        document.querySelector('.circle').style.left = (currSong.currentTime / currSong.duration) * 100 + '%'
    })

    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let progress = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector('.circle').style.left = progress + '%'
        currSong.currentTime = ((currSong.duration) * progress) / 100
    })

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0'
    })

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-160%'
    })

    prev.addEventListener('click', () => {
        currSong.pause()
        let index = songs.indexOf(currSong.src.split('/').slice(-1)[0])
        if ((index - 1) >= 0) {
            playsong(songs[index - 1])
        }
    })

    next.addEventListener('click', () => {
        currSong.pause()
        let index = songs.indexOf(currSong.src.split('/').slice(-1)[0])
        if ((index + 1) < songs.length) {
            playsong(songs[index + 1])
        }
    })

    document.querySelector('.vol').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currSong.volume = parseInt(e.target.value) / 100
    })

}

main()