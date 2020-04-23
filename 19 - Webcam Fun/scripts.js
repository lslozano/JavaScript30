const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Get access to the camera from the navigator.
function getVideo() {
  // From navigator access media devices and get the user media.
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    // This returns a promise that is an object of data.
    .then(localMediaStream => {
      // This is now deprecated: video.src = window.URL.createObjectURL(localMediaStream)
      // Pass the media object as a srcObject to the video directly.
      video.srcObject = localMediaStream
      video.play()
    })
    // Catch the error:
    .catch(error => console.error(`Something went wrong:`, error))
}

function paintToCanvas() {
  // Need to get ahold of the videoWidth and videoHeight.
  // We need to make sure that the canvas is the exact same size as the vide.
  const width = video.videoWidth
  const height = video.videoHeight
  canvas.width = width
  canvas.height = height

  // Execute set interval function with returns an anonymous function
  // This will execute inside the curly braces a draw
  // on the context, passing as arguments:
  // video - as the image source.
  // x and y position - where to start.
  // widht and height  - where to finish drawing.
  // Return the setInterval to have access to it. In case you need to stop it.
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)

    // The way a filter works is you get the pixels out of the
    // canvas and you mess with them, changing the rgb values and putting them
    // back in.
    // Gets all the data from the image, which will be huge
    // arrays showing all the pixel color values that conform the
    // image.
    let pixels = ctx.getImageData(0, 0, width, height)

    // Creates the red effect in our pixels with our function.
    //pixels = redEffect(pixels)
    // Creates an split color in our image.
    pixels = rgbSplit(pixels)
    // This creates a transparency in the image and as it goes it stacks.
    //ctx.globalAlpha = 0.1

    // Use the greenScreen function to change the filter with the input
    // type range.
    //pixels = greenScreen(pixels)

    // Put them back.
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

/*
This function was meant to make a sound each time a photo was taken
but the source for the audio from Wes Bos site can't be accessed.
*/
function takePhoto() {
  // Emit a sound each time photo is taken.
  // snap.currentTime = 0
  // snap.play()

  // Take the data out of the canvas.
  // toDataURL returns a data URI containing the representation of
  // the image.
  // This is the way we get the image from the canvas.
  const data = canvas.toDataURL('image/jpeg')

  // Create an anchor element.
  const link = document.createElement('a')

  // Make its reference the data.
  link.href = data

  // Set it's attribute as download and the file name that it 
  // downloads as handsome.
  link.setAttribute('download', 'handsome')

  // Create an image element with the data as an 
  // inner html element of the link.
  link.innerHTML = `<img src=${data} alt='Handsome man'/>`

  // In strip insert the element link before it's first
  // child
  strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
  // Loop over every single pixel that I have.
  // Needs to be done accessing .data, that is the array.
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Then we have access to each pixel to modify its values
    // to alter the colors.
    pixels.data[i + 0] = pixels.data[i + 0] + 100 // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50 // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // BLUE
  }
  // Return the modified pixels.
  return pixels
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Change the colors of the pixels that are in
    // a different position way back or way forward in the
    // array.
    pixels.data[i - 150] = pixels.data[i + 0] // RED
    pixels.data[i + 100] = pixels.data[i + 1] // GREEN
    pixels.data[i - 150] = pixels.data[i + 2] // BLUE
  }
  // Return the modified pixels.
  return pixels
}

function greenScreen(pixels) {
  // Create an object that will hold the key value pairs of:
  // pixel and its value.
  const levels = {}

  // Get hold of the class rgb and its inputs and set
  // the input name as a key in levels object and input value as its
  // value.
  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value
  })

  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0]
    green = pixels.data[i + 1]
    blue = pixels.data[i + 2]
    alpha = pixels.data[i + 3]

    // If the colors are anywhere in between those min and max values
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
        // Then, take it out and change the transparency.
        pixels.data[i + 3] = 0
      }
  }
  return pixels
}

getVideo()

// canplay is an event that the video will emit.
// Once the video is playing is going to emit the event
// canplay and with the event listener we execute the function
// paintToCanvas.
video.addEventListener('canplay', paintToCanvas)