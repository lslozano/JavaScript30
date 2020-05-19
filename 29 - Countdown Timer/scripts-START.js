// This exercise will focus on creating a timer for a break.

// A set interval does not work properly here.
// When you are in browser and jump to another window, the interval stops executing after a while.
// In iOS it stops executing when you scroll down.

// We need to store the interval in it's own variable.
let countdown;

const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')

// Select everything that has the data-time dataset attribute.
const buttons = document.querySelectorAll('[data-time]')

// First we need to create a function that receive the seconds of the break.
function timer(seconds) {
  // Clear any existing timers.
  clearInterval(countdown)

  // Use the built in constructor to get the present date. It returns the timestamp in miliseconds.
  const now = Date.now()

  // Create a variable that will hold the time where our counter will end.
  // We add to the miliseconds of now and the seconds that are passed as an argument.
  // Since now is in miliseconds, we need to multiply the seconds to a thousand.
  const then = now + seconds * 1000

  displayTimeLeft(seconds) // Immediatly display the seconds passed.

   // Pass then as the timestamp needed for when the timer is going to end.
  displayEndTime(then)
  // This does not have to update every second.

  // Next up, every single second we need to display the amount of time left.
  // This interval will run every second.
  countdown = setInterval(() => {
    // Substract the value of now to then.
    // This way we can get the seconds remaining on our timer..
    // Divide by a thousands since the value is in miliseconds and round the result.
    const secondsLeft = Math.round((then - Date.now()) / 1000)

    // Check if we should stop the interval
    if (secondsLeft < 0) {
    // With a clear interval this will never run again; not until it is set again.
      clearInterval(countdown)
      return
    }

    // Display the seconds left on the timer.
    displayTimeLeft(secondsLeft)
  }, 1000)
}

function displayTimeLeft(seconds) {
  // Here we are going to convert to minutes and seconds.
  // We need to get whole minutes, so we apply Math.floor.
  const minutes = Math.floor(seconds / 60)
  // Get the remainder seconds, this is done by doing a modulo operation on seconds.
  const remainderSeconds = seconds % 60

  // Save into a constant the values of the time.
  // Create a ternary operator for when the remaining seconds are less than 10 so it adds
  // a 0 to the countdown.
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`

  // Update the title in our HTML.
  document.title = display

  // Pass this as the value of the text content in our class.
  timerDisplay.textContent = display
}

// Create a function that will display at what time our countdown will end.
function displayEndTime(timestamp) {
  // Date.now returns the number of miliseconds that have passed since the UNIX epoch.
  // If you pass those miliseconds as a new Date, it will convert that to a proper time stamp.
  // With day, month, year, time.
  const end = new Date(timestamp)

  // From that, get the hour and minutes.
  const hours = end.getHours()
  const minutes = end.getMinutes()

  endTime.textContent = `Be Back at ${hours}:${minutes}`

  /* 
  If we wanted to adjust the endTime to 12 hours, we would need to do the following:
  const adjustedHour = hour > 12 ? : hour - 12 : hour
  endTime.textContent = `Be Back at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`
  */
}


function startTimer() {
  // dataset gives us a string, so we parse it to an integer.
  const seconds = parseInt(this.dataset.time)
  timer(seconds)
  // console.log(this.dataset.time) We access the dataset of the instance and get 
  // the time value. This way, we can pass that value to our functions.
}

buttons.forEach(button => button.addEventListener('click', startTimer))

// If an element has a custom name, you can access it directly by that name.
// In this case, "customForm"
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault() // prevents reload.
  const minutes = this.minutes.value // grabs the value in the input.
  timer(minutes * 60) // pass the minutes to seconds and as an argument of the function.
  this.reset() // clears the input.
})