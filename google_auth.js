let signin_button = document.getElementById("signin_button")
let signout_button = document.getElementById("signout_button")
let user_name = document.getElementById("user_name")
let user_image = document.getElementById("user_image")

let auth_divs = {
	false: document.getElementById("auth_false"),
	true: document.getElementById("auth_true"),
}

var GoogleAuth



function initGapi() {
	gapi.load('client', initGapiClient)
}

function initGapiClient() {
	gapi.client.init({
		'apiKey': 'AIzaSyAmOXAXhaj_qNqlyyXoWVPXK_E7mmKdBvU',
		'clientId': '917679730606-hhojroi8m0q1u2tjaa6pppf0r54o32hb.apps.googleusercontent.com',
		'scope': 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
		'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
	}).then(function () {
		GoogleAuth = gapi.auth2.getAuthInstance()
		GoogleAuth.isSignedIn.listen(updateSigninStatus)
		updateSigninStatus(GoogleAuth.isSignedIn.get())
	})
}


function updateFile(fileId, fileMetadata, fileData, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";
	
	var multipartRequestBody =
		delimiter +
		'Content-Type: application/json\r\n\r\n' +
		JSON.stringify(fileMetadata) +
		delimiter +
		'Content-Type: application/json\r\n' +
		'\r\n' +
		JSON.stringify(fileData) +
		close_delim;

	var request = gapi.client.request({
		'path': '/upload/drive/v2/files/' + fileId,
		'method': 'PUT',
		'params': {'uploadType': 'multipart'},
		'headers': {
			'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		},
		'body': multipartRequestBody})
	if (!callback) {
	  callback = function(file) {}
	}
	request.execute(callback);
}



let saveFileId

function clearAppDataFolder() {
	gapi.client.drive.files.list(
		{spaces: 'appDataFolder'}
	).then(function(response) {
		for (const file of response.result.files) {
			gapi.client.drive.files.delete({fileId: file.id}).then()
		}
	})
}

function load() {
	gapi.client.drive.files.list({
		spaces: 'appDataFolder'
	}).then(function(response) {
		for (const file of response.result.files) {
			if (file.name == 'overclicker.save') {
				saveFileId = file.id
				break;
			}
		}
		if (saveFileId) {
			gapi.client.drive.files.get({
				fileId: saveFileId,
				alt: "media"
			}).then(function(response) {
				gameInfo = response.result
				updateValue(0)
			})
		}
	})
}

function save() {
	if (saveFileId) {
		updateFile(saveFileId, {}, gameInfo)
	} else {
		gapi.client.drive.files.create({
			resource: {
				'name': 'overclicker.save',
				'mimeType': 'application/json',
				'parents': ['appDataFolder'],
			},
		}).then(function(response) {
			saveFileId = response.result.id
		})
		updateFile(saveFileId, {}, gameInfo)
	}
}



signin_button.addEventListener("click", function() {
	GoogleAuth.signIn()
})

signout_button.addEventListener("click", function() {
	save()
	GoogleAuth.signOut()
})

function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		let user = GoogleAuth.currentUser.get()
		let profile = user.getBasicProfile()
		user_name.innerText = profile.getName()
		user_image.src = profile.getImageUrl()
		load()
	} else {
		saveFileId = undefined
		resetGame()
	}
	auth_divs[isSignedIn].style.display = "block"
	auth_divs[!isSignedIn].style.display = "none"
}
