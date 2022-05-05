let clicks_counter = document.getElementById("clicks_counter")
let click_button = document.getElementById("click_button")
let upgrade_button = document.getElementById("upgrade_button")



let gameInfo

function resetGame() {
	gameInfo = {}
	gameInfo.value = 0
	gameInfo.increasePerClick = 1
	gameInfo.upgrade_price = 5
	updateValue(0)
}

resetGame()



function updateValue(d) {
	if (d < 0 && gameInfo.value < -d) { return false }
	gameInfo.value += d
	clicks_counter.innerText = gameInfo.value.toString()
	return true
}

click_button.addEventListener("click", function() {
	updateValue(gameInfo.increasePerClick)
})

upgrade_button.addEventListener("click", function() {
	let res = updateValue(-gameInfo.upgrade_price)
	if (!res) { return }
	gameInfo.increasePerClick += 1
})
