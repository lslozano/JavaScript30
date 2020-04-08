// Get our Elements
const videoPlayer = document.querySelector('.player')
const video = videoPlayer.querySelector('.viewer')
const progress = videoPlayer.querySelector('.progress')
const progressBar = videoPlayer.querySelector('.progress__filled')

const playButton = videoPlayer.querySelector('.toggle')
const skipButtons = videoPlayer.querySelectorAll('[data-skip]')
const fullscreenButton = videoPlayer.querySelector('.fullscreen')
const ranges = videoPlayer.querySelectorAll('.player__slider')

// Build out functions
function togglePlay() {
  const method = video.paused ? 'play' : 'pause'
  video[method]()
  /*
  First approach
  if (video.paused) {
    video.play()
  } else {
    video.pause()
  }
  */
}

function updateButton() {
  //We can use this.paused because it is bound to the vide itself.
  //So it refers to the object.
  //const icon = this.paused ? '►' : '❚ ❚';
  //playButton.textContent = icon;
  playButton.textContent = this.paused ? '►' : '❚ ❚';
  /*
  First approach
  if (video.paused) {
    playButton.textContent = '►'
  } else if (video.play) {
    playButton.textContent = '❚ ❚'
  }
  */
}

function skipTime() {
  //Final way to do it. Easier and more simple.
  //this.dataset refers to an object which has the skip value.
  //Since the value is a string, we turn it into an Int.
  video.currentTime += parseInt(this.dataset.skip)

  /*
  Second approach:
  if (this.dataset.skip == 25) {
    video.currentTime += 25
  } else if (this.dataset.skip == -10) {
    video.currentTime -= 10
  }
  */

  /*
  This was my first approach, but it's kind of redundant because
  we have a nested loop within a loop when calling the function.

  skipButtons.forEach(button => {
    if (button.innerText === '« 10s') {
      video.currentTime -= 10
    } else if (button.innerText === '25s »') {
      video.currentTime += 25
    }
  })
  */

}

function handleRangeUpdate() {
  //ranges node list with two elements. Each one with properties.
  //console.log(this.name) volume or playbackRate
  //To set the value of each property just set the property to the corresponding value.
  //this.name access the property that corresponds, either volume or playbackRate.
  video[this.name] = this.value

  /*
  This was my approach and it worked:

  if (this.name == 'volume') {
    video.volume = this.value
  } else if (this.name == 'playbackRate') {
    video.playbackRate = this.value
  }
  */
}

//Handles the progress of the video bar.
function handleProgress() {
  //Establish a value equivalent to the progress of the video.
  const percent = (video.currentTime / video.duration) * 100
  //Add that value to the style on flexBasis.
  progressBar.style.flexBasis = `${percent}%`
}

function scrub(e) {
  //Save into a scrubTime constant the result of dividing the x position at where our event occurred 
  // to the width of the progress bar. It gives us a percentage.
  //Multiply it by the video duration.
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  //Update the value of current time of the vide to the scrubTime.
  video.currentTime = scrubTime
  
}

//Make video fullscreen.
function fullscreen() { 	  
  video.webkitRequestFullscreen();
}

// Hook up the event listeners
video.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)
//Event that listens for every update in the time of our video.
video.addEventListener('timeupdate', handleProgress)
playButton.addEventListener('click', togglePlay)
//We need to access the specific element within the nodelist of
//skipButtons.
skipButtons.forEach(button => {
  button.addEventListener('click', skipTime)
})
//For ranges, again we need to access specific values, since it is a
//Node List.
//This events help update in real time.
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate)
})
ranges.forEach(range => {
  range.addEventListener('mousemove', handleRangeUpdate)
})

/*
First I tried with only a click event, but we need to hear for change and mousemove.
ranges.forEach(range => {
  range.addEventListener('click', handleRangeUpdate)
})
*/


//Mouse down flag variable
let mouseDown = false
//Listener for when a click occurs on our progress bar and run scrub function to modify video progress to
//wherever we had clicked. 
progress.addEventListener('click', scrub)
//Creates an event that hears for mouse move. Checks if mouseDown is true
//it runs our function scrub receiving the event to get the offsetX property of it.
progress.addEventListener('mousemove', (e) => mouseDown && scrub(e))
//When mouse is down, change mouseDown to true.
progress.addEventListener('mousedown', () => mouseDown = true)
//When mouse is up, change mouseDown to false.
progress.addEventListener('mouseup', () => mouseDown = false)

//Event listener to change our video to fullscreen.
fullscreenButton.addEventListener('click', fullscreen)

//Note: event listeners must be done in specific elements.
//No in node lists or varios tags/elements.
//When an event listener can be added to an "element", it means 
//it is not a single element.

