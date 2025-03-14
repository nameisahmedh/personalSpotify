let currentSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

 songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
      //   songs.push(element.href)
    }
  }
    // Show all songs in the playlist
    let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML = ""

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      ` <li>
          <img class="invert" src="svgs/music.svg" alt="">
                <div class="info">
                     <div> ${song.replaceAll("%20", " ")}</div>
                          <div>Ahmed</div>
                    </div>
                <div class="playnow">
                   <span>Play Now</span>
                  <img class="invert" src="svgs/play.svg" alt=""
                </div>
         </li>`;
  }

  // Attach an eventListener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+ track)
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "svgs/pause.svg";
  }
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  
};

function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let flexparent = document.querySelector(".flexparent")
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
      let folder = e.href.split("/").slice(-2)[0]
        // Get the metadata of the folder
        let a = await fetch(`/songs/${folder}/info.json`)
        let response = await a.json()
        flexparent.innerHTML = flexparent.innerHTML + `<div data-folder="${folder}" class="flexchild">
                        <div class="playicon"><img src="svgs/play2.svg" alt=""></div>
                        <div class="names">
                            <img src="/songs/${folder}/copy.jpg" alt="" class="img img1">
                            <div class="name">${response.title}</div>
                            <div class="name2">${response.description}</div>
                        </div>
                    </div>`
    }
  }

  // Load the Playlist when a card is clicked
Array.from(document.getElementsByClassName("flexchild")).forEach((e) => {
  e.addEventListener("click", async (item) => {
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    playMusic(songs[0])
  });
});
  
  
}
async function main() {
  await getSongs("songs/Pritam");
  playMusic(songs[0], true);

  // Display all the albums in the page
  displayAlbums()

  // Add eventListener for prev,play and next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svgs/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an eventListener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  
  // Add an eventListener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".left").style.position = "fixed";
    document.querySelector(".left").style.marginTop = "50px";
  document.querySelector(".spotify").style.display = "block";
  document.querySelector(".hamburger").style.display = "none";
  document.querySelector(".homebox").style.display = "none";
  document.querySelector(".closeimg").style.display = "block";
  document.querySelector(".playbar").style.width = "96%";
});

document.querySelector(".closeimg").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-110%";
  document.querySelector(".spotify").style.display = "none";
  document.querySelector(".hamburger").style.display = "block";
  document.querySelector(".closeimg").style.display = "none";
  document.querySelector(".closeimg").style.transition = "all .3s";
  document.querySelector(".homebox").style.display = "block";
});



// Add eventListener to previous
prev.addEventListener("click", () => {
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index - 1 >= 0) {
    playMusic(songs[index - 1]);
  }
});

// Add eventListener to next
next.addEventListener("click", () => {
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  }
});

// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  currentSong.volume = parseInt(e.target.value) / 100
  if (currentSong.volume >0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
  }
})

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e=>{ 
  if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

})

  
}
  main();
  