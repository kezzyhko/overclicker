let clicks_counter = document.getElementById("clicks_counter")
let click_button = document.getElementById("click_button")
let upgrade_button = document.getElementById("upgrade_button")

let value = 0
let increasePerClick = 1
let upgrade_price = 5

function updateClicks(d) {
	if (d < 0 && value < -d) { return false }
	value += d
	clicks_counter.innerText = value.toString()
	return true
}

click_button.addEventListener("click", function() {
	updateClicks(increasePerClick)
})

upgrade_button.addEventListener("click", function() {
	let res = updateClicks(-upgrade_price)
	if (!res) { return }
	increasePerClick += 1
})

