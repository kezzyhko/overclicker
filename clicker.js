let clicks_counter = document.getElementById("clicks_counter")
let click_button = document.getElementById("click_button")

let clicks = 0

click_button.addEventListener("click", function() {
	clicks++
	clicks_counter.innerText = clicks.toString()
})