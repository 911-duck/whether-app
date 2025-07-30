/***************SITE_PART**************/

// elements
const searchBlock = document.querySelector(".menu")
const searchButton = document.querySelector('.weather__search-icon')
const closeSearchButton = document.querySelector('.menu__close-icon')

// functions
function openSearchBlock() {
	searchBlock.style.left = "20px"
	searchButton.removeEventListener("click", openSearchBlock)
	closeSearchButton.addEventListener("click", closeSearchBlock)
}

function closeSearchBlock() {
	searchBlock.style.left = "calc(-40% - 20px)"
	searchButton.addEventListener("click", openSearchBlock)
	closeSearchButton.removeEventListener("click", closeSearchBlock)
}

searchButton.addEventListener("click", openSearchBlock)

/*****************FETCH****************/

//elements
const apiKey = 'f13eebcc254c9c8dbf6812edb75bb47c'
const searchBtn = document.querySelector('.menu__send')
const cityInput = document.querySelector('.menu__input')

const menuHistory = document.querySelector('.menu__history')

const weatherTitle = document.querySelector('.weather__title')
const weatherTemp = document.querySelector('.weather__temp')
const weatherIcon = document.querySelector('.weather__icon')

const weatherTempForWeek = document.querySelectorAll('.week__temp')
const weatherIconForWeek = document.querySelectorAll('.week__icon')
const weatherDateOfWeek = document.querySelectorAll('.week__day-info')

const weatherTempForHours = document.querySelectorAll('.temp__number')
const weatherTimeForHours = document.querySelectorAll('.temp__time')

const switchDarkMode = document.querySelector('#checkbox')

const weatherInfoItmes = document.querySelectorAll('.weather__info-item')

const mainPageBtn = document.querySelector('.weather__main-btn')
const graphPageBtn = document.querySelector('.weather__graph-btn')
const mainPage = document.querySelector('.weather__main')
const graphPage = document.querySelector('.weather__graph')

let temperatureChart = null
let temperatureChartFD = null

const now = new Date();
const hours = now.getHours();

document.querySelectorAll('.menu__window')[1].innerHTML = localStorage.getItem("isbranoe")

let historyItems = document.querySelectorAll('.menu__items')
let linkItems = document.querySelectorAll('.link')
let unlinkItems = document.querySelectorAll('.unlink')

let curCity = "Minsk"
getWeatherData(curCity)
getWeatherForWeek(curCity)

let icons = {
	Cloud: '<i class="fa-solid fa-cloud"></i>',
	Rain: '<i class="fa-solid fa-cloud-showers-heavy weather__cloud-showers-heavy"></i>',
	Clear: '<i class="fa-solid fa-sun"></i>',
	Snow: '<i class="fa-solid fa-snowflake"></i>',
	Thunderstorm: '<i class="fa-solid fa-cloud-bolt"></i>',
	Mist: '<i class="fa-solid fa-smog"></i>',
	ClearN: '<i class="fa-solid fa-moon"></i>'
}

let background = {
	Cloud: 'url("./img/clouds-cloudscape-cloudy-158163.jpg")',
	Rain: 'url("./img/rain-316579_960_720.jpg")',
	Clear: 'url("./img/clouds-blue-sky_87394-22252.jpg")',
	Snow: 'url("./img/winter-snow-nature-60561.jpeg")',
	Thunderstorm: 'url("./img/R.jpg")',
	Mist: 'url("./img/carpathian-mountain-865252_1280.jpg")',
	NightMode: 'url("./img/night-27.jpg")'
}


// Когда мы посылаем запрос на сторонний, ответ приходит не мгновенно, а через какое-то время.
// Поэтому нам нужно дождаться ответа от сервера и отобразить его, однако,
// чтобы не блокировать приложение в момент получения ответа, мы используем промисы

// Промис это обещание вернуть ответ позже.
// Состояния промиса: pending (ожидание), rejected (отказано), fulfilled (успешно)

function getWeatherData(city) {
	document.querySelector('.loading-background').style.display = 'flex'
	document.querySelector('.loading-background').style.backdropFilter = 'blur(5px)'
	// fetch механизм отправки запроса
	//.then если промис fulfilled и мы получаем что-то
	//.catch если промис геjected и мы получаем ошибку
	fetch(
		`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
	)
		.then(response => {
			if (!response.ok) {
				console.log("Город не найден")
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 404"
				document.querySelector(".errorWindow__discription").innerText = "город не найден"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
				return
			}
			if (response.status == 400000) {
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 400000"
				document.querySelector(".errorWindow__discription").innerText = "подписка на айпи ключ закончилась"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
			}
			if (response.status == 429) {
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 429"
				document.querySelector(".errorWindow__discription").innerText = "превышение лимита вашей подписки"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
			}
			if (response.status == 401) {
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 401"
				document.querySelector(".errorWindow__discription").innerText = "неправильный айпи ключ"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
			}
			return response.json()
		})
		.then(data => {
			if (Number(data.cod) != 404) {
				curCity = city
				weatherTitle.innerText = city
				let flag = false
				for (let i = 0; i < historyItems.length; i++) {
					console.log(historyItems[i].innerText)
					console.log(curCity)
					if (historyItems[i].innerText == curCity) flag = true
				}
				if (flag == false) {
					menuHistory.innerHTML += `<li class="menu__items"><i class="fa-solid fa-location-dot"></i>${curCity}<i class="fa-solid fa-link link"></i></li>`
					removeEventListenerForHistoryItems()
					removeEventListenerForLinks()
					historyItems = document.querySelectorAll('.menu__items')
					linkItems = document.querySelectorAll('.link')
					unlinkItems = document.querySelectorAll('.unlink')
					addEventListenerForHistoryItems()
					addEventListenerForLinks()
				}
				console.log(data)
				const temp = data.main.temp
				displayWeatherData(temp, weatherTemp)
				const status = data.weather[0].main
				displayWeather(status, weatherIcon, 0)
				displayMoreInfo(data.wind.speed, data.main.humidity, data.wind.deg, data.main.pressure)
			}
		})
		.catch(error => {
		})
		.finally(e => {
			setTimeout(() => {
				document.querySelector('.loading-background').style.display = 'none'
			}, 1000);
			document.querySelector('.loading-background').style.backdropFilter = 'blur(0px)'
		})
}

function getWeatherForWeek(city) {
	const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

	fetch(url)
		.then(response => {
			if (!response.ok) {
				console.log("Город не найден")
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 404"
				document.querySelector(".errorWindow__discription").innerText = "город не найден"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
				return
			}
			if (response.status == 400000) {
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 400000"
				document.querySelector(".errorWindow__discription").innerText = "подписка на айпи ключ закончилась"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
			}
			if (response.status == 429) {
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 429"
				document.querySelector(".errorWindow__discription").innerText = "превышение лимита вашей подписки"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
			}
			if (response.status == 401) {
				document.querySelector(".errorWindow").style.top = "calc( 40px - 15px)"
				document.querySelector(".errorWindow__title").innerText = "ошибка 401"
				document.querySelector(".errorWindow__discription").innerText = "неправильный айпи ключ"
				setTimeout(() => {
					document.querySelector(".errorWindow").style.top = "-220px"
				}, 5000);
			}
			return response.json()
		})
		.then(data => {
			if (Number(data.cod) != 404) {
				console.log(data)
				console.log(Math.floor(24 / 3 - hours / 3))
				for (let i = Math.floor(24 / 3 - hours / 3); i < 32; i += 8) {
					const status = data.list[i + 5].weather[0].main
					displayWeather(status, weatherIconForWeek[(i - Math.floor(24 / 3 - hours / 3)) / 8], 1)
					const temp = data.list[i + 5].main.temp
					displayWeatherData(temp, weatherTempForWeek[(i - Math.floor(24 / 3 - hours / 3)) / 8])
					weatherDateOfWeek[(i - Math.floor(24 / 3 - hours / 3)) / 8].innerText = (new Date(data.list[i].dt * 1000)).toLocaleDateString('ru-RU', { weekday: 'short' }).toLowerCase()
					const status2 = data.list[i + 2].weather[0].main
					displayWeather(status2, weatherIconForWeek[(i - Math.floor(24 / 3 - hours / 3)) / 8 + 5], 3)
					const temp2 = data.list[i + 2].main.temp
					displayWeatherData(temp2, weatherTempForWeek[(i - Math.floor(24 / 3 - hours / 3)) / 8 + 5])
					weatherDateOfWeek[(i - Math.floor(24 / 3 - hours / 3)) / 8 + 5].innerText = (new Date(data.list[i].dt * 1000)).toLocaleDateString('ru-RU', { weekday: 'short' }).toLowerCase()
					weatherDateOfWeek[(i - Math.floor(24 / 3 - hours / 3)) / 8 + 5].innerText += " - ночь"
				}
				const chartDataFD = {
					dates: [],
					temps: []
				}
				for (let i = Math.floor(24 / 3 - hours / 3); i < Math.floor(24 / 3 - hours / 3) + 5; i++) {
					const temp = data.list[i].main.temp
					chartDataFD.temps.push(temp)
					displayWeatherData(temp, weatherTempForHours[i - Math.floor(24 / 3 - hours / 3)])
					if ((i - Math.floor(24 / 3 - hours / 3)) * 3 + hours < 25) weatherTimeForHours[i - Math.floor(24 / 3 - hours / 3)].innerText = `${(i - Math.floor(24 / 3 - hours / 3)) * 3 + hours}:00`
					else weatherTimeForHours[i - Math.floor(24 / 3 - hours / 3)].innerText = `${((i - Math.floor(24 / 3 - hours / 3)) * 3 + hours) - 24}:00`
					if (temp < 35) document.querySelectorAll('.temp__diagramm')[i - Math.floor(24 / 3 - hours / 3)].style.height = `${(75 / 35) * temp}%`
					else document.querySelectorAll('.temp__diagramm')[i - Math.floor(24 / 3 - hours / 3)].style.height = `100%`
					chartDataFD.dates.push(weatherTimeForHours[i - Math.floor(24 / 3 - hours / 3)].innerText)
				}

				const chartDataDay = {
					dates: [],
					temps: []
				}
				
				const chartDataNight = {
					dates: [],
					temps: []
				}

				for (let i = 0; i < data.list.length; i += 8) {
					let currentDate = new Date(data.list[i].dt * 1000)
					currentDate = currentDate.toLocaleDateString('ru-RU', {
						weekday: 'short'
					})
					let currentTemp = data.list[i].main.temp

					chartDataDay.dates.push(currentDate)
					chartDataDay.temps.push(currentTemp)
					chartDataNight.temps.push(currentTemp + Math.floor(Math.random() * 5))
				}

				renderTemperatureChart({
					dates: chartDataDay.dates,
					dayTemps: chartDataDay.temps,
					nightTemps: chartDataNight.temps
				},{
					dates: chartDataFD.dates,
					dayTemps: chartDataFD.temps,
				})
				console.log({
					dates: chartDataDay.dates,
					dayTemps: chartDataDay.temps,
					nightTemps: chartDataNight.temps
				},{
					dates: chartDataFD.dates,
					dayTemps: chartDataFD.temps,
				})


			}
		})
		.catch(error => {

		})
}

// Отображение графика для погоды на 5 дней через Chart.js
const renderTemperatureChart = (data,data2) => {
	const ctx = document.getElementById('temperatureChart').getContext('2d')
	const ctx2 = document.getElementById('temperatureChartForDay').getContext('2d')

	if (temperatureChart) temperatureChart.destroy()
	if (temperatureChartFD) temperatureChartFD.destroy()

	temperatureChartFD = new Chart(ctx2, {
		type: 'line',
		data: {
			labels: data.dates,
			datasets: [
				{
					label: 'День',
					data: data.dayTemps,
					borderColor: '#fff',
					backgroundColor: 'rgba(184, 184, 184, 0.384)',
					pointRadius: 6,
					pointHoverRadius: 8,
					borderWidth: 4,
					color: '#fff',
					fill: true,
					tension: 0.5
				},
				{
					label: 'Ночь',
					data: data.nightTemps,
					color: '#fff',
					borderColor: '#1a1a1ae1',
					backgroundColor: '#1a1a1a6b',
					pointRadius: 6,
					pointHoverRadius: 8,
					borderWidth: 4,
					fill: true,
					tension: 0.5
				}
			]
		},
		options: {
			plugins: {
				legend: {
					labels: {
						font: { size: 23 },
						color: '#fff'
					}
				},
				title: {
					display: true,
					text: 'погода в ближайшее время',
					font: { size: 30 },
					color: '#fff'
				}
			},
			animations: {
				tension: {
					duration: 1000,
					from: 1,
					to: 0,
				},
				y: {
						easing: 'easeOutInElastic',
						// loop:true
				},
			},
			scales: {
				x: {
					grid: {
						display: false
					},
					ticks: {
						color: '#fff',
						font: {
							size: 20
						}
					}
				},
				y: {
					grid: {
						display: false
					},
					ticks: {
						color: '#fff',
						font: {
							size: 20
						}
					}
				}
			}
		}
	})
	temperatureChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: data2.dates,
			datasets: [
				{
					label: 'температура',
					data: data2.dayTemps,
					borderColor: '#fff',
					backgroundColor: 'rgba(184, 184, 184, 0.384)',
					pointRadius: 6,
					pointHoverRadius: 8,
					borderWidth: 4,
					color: '#fff',
					fill: true,
					tension: 0.5
				},
			]
		},
		options: {
			plugins: {
				legend: {
					labels: {
						font: { size: 23 },
						color: '#fff'
					}
				},
				title: {
					display: true,
					text: 'погода на 5 дней',
					font: { size: 30 },
					color: '#fff'
				}
			},
			animations: {
				tension: {
					duration: 1000,
					from: 1,
					to: 0,
				},
				y: {
						easing: 'easeOutInElastic',
						// loop:true
				},
			},
			scales: {
				x: {
					grid: {
						display: false
					},
					ticks: {
						color: '#fff',
						font: {
							size: 20
						}
					}
				},
				y: {
					grid: {
						display: false
					},
					ticks: {
						color: '#fff',
						font: {
							size: 20
						}
					}
				}
			}
		}
	})
	
}


function displayWeatherData(temp, item) {
	item.innerText = `+${Math.floor(temp)}°`
}

function displayWeather(status, item, debug) {
	// console.log(status)
	if (status == "Rain") {
		item.innerHTML = icons.Rain
		if (debug == 0 && nightMode == true) document.querySelector('body').style.backgroundImage = background.Rain
	} else if (status == "Clouds") {
		item.innerHTML = icons.Cloud
		if (debug == 0 && nightMode == true) document.querySelector('body').style.backgroundImage = background.Cloud
	} else if (status == "Clear") {
		item.innerHTML = icons.Clear
		if (debug == 0 && nightMode == true) document.querySelector('body').style.backgroundImage = background.Clear
		if (debug == 3) item.innerHTML = icons.ClearN
	} else if (status == "Snow") {
		item.innerHTML = icons.Snow
		if (debug == 0 && nightMode == true) document.querySelector('body').style.backgroundImage = background.Snow
	} else if (status == "Thunderstorm") {
		item.innerHTML = icons.Thunderstorm
		if (debug == 0 && nightMode == true) document.querySelector('body').style.backgroundImage = background.Thunderstorm
	} else if (status == "Mist") {
		item.innerHTML = icons.Mist
		if (debug == 0 && nightMode == true) document.querySelector('body').style.backgroundImage = background.Mist
	}
	if (debug == 0 && nightMode != true) document.querySelector('body').style.backgroundImage = background.NightMode
	if (debug == 0) document.querySelector('body').style.backgroundSize = 'cover'
	if (debug == 0) document.querySelector('body').style.backgroundRepeat = 'no-repeat'
}

function displayMoreInfo(speed, humidity, deg, pressure) {
	weatherInfoItmes[0].innerHTML = `<i class="fa-solid fa-wind" ></i>скорость ветра : ${speed}м/с`
	let result = "с"
	if (deg > 355 && deg < 5) {
		result = "c"
	} else if (deg > 85 && deg < 95) {
		result = "в"
	} else if (deg < 90) {
		result = "с-в"
	} else if (deg > 175 && deg < 185) {
		result = "ю"
	} else if (deg < 180) {
		result = "ю-в"
	} else if (deg > 265 && deg < 275) {
		result = "з"
	} else if (deg < 270) {
		result = "ю-з"
	} else {
		result = "с-з"
	}
	weatherInfoItmes[1].innerHTML = `<i class="fa-regular fa-compass"style="transform: rotate(${-45 + deg}deg) scale(1.5); margin-right: 5px;"></i>направление ветра : ${result}`
	weatherInfoItmes[2].innerHTML = `<i class="fa-solid fa-droplet"></i>влажность : ${humidity}%`
	weatherInfoItmes[3].innerHTML = `<i class="fa-regular fa-square"></i>давление : ${pressure}mbar`
}

/*background-size: cover
	background-repeat: no-repeat */

setInterval(() => {
	getWeatherData(curCity)
	getWeatherForWeek(curCity)
}, 10000);

function EventListenerForHistoryItem(e) {
	for (let i = 0; i < linkItems.length; i++) {
		if (e.target == linkItems[i]) return
	}
	for (let i = 0; i < unlinkItems.length; i++) {
		if (e.target == unlinkItems[i]) return
	}
	curCity = e.target.innerText
	console.log(e.target.innerText)
	getWeatherData(curCity)
	getWeatherForWeek(curCity)

}

function EventListenerForLink(e) {
	console.log(e.target.parentElement.innerText)
	e.target.parentElement.remove
	removeEventListenerForHistoryItems()
	document.querySelectorAll('.menu__window')[1].innerHTML += `<li class="menu__items"><i class="fa-solid fa-link"></i>${e.target.parentElement.innerText} <i class="fa-solid fa-link-slash unlink"></i></li>`
	historyItems = document.querySelectorAll('.menu__items')
	unlinkItems = document.querySelectorAll('.unlink')
	addEventListenerForHistoryItems()
	removeEventListenerForUnlinks()
	addEventListenerForUnlinks()
	localStorage.setItem("isbranoe", String(document.querySelectorAll('.menu__window')[1].innerHTML))
}

function EventListenerForUnlink(e) {
	console.log(e.target.parentElement)
	e.target.parentElement.style.display = "none"
	// removeEventListenerForHistoryItems()
	// document.querySelectorAll('.menu__window')[1].innerHTML += `<li class="menu__items"><i class="fa-solid fa-link"></i>${e.target.parentElement.innerText} <i class="fa-solid fa-link-slash link"></i></li>`
	// historyItems = document.querySelectorAll('.menu__items')
	unlinkItems = document.querySelectorAll('.unlink')
	addEventListenerForHistoryItems()
	removeEventListenerForUnlinks()
	addEventListenerForUnlinks()
	localStorage.setItem("isbranoe", String(document.querySelectorAll('.menu__window')[1].innerHTML))

}

//EventListeners

addEventListenerForHistoryItems()

function addEventListenerForHistoryItems() {
	for (let i = 0; i < historyItems.length; i++) {
		historyItems[i].addEventListener('click', EventListenerForHistoryItem)
	}
}

addEventListenerForLinks()

function addEventListenerForLinks() {
	for (let i = 0; i < linkItems.length; i++) {
		linkItems[i].addEventListener('click', EventListenerForLink)
	}
}

addEventListenerForUnlinks()

function addEventListenerForUnlinks() {
	for (let i = 0; i < unlinkItems.length; i++) {
		unlinkItems[i].addEventListener('click', EventListenerForUnlink)
	}
}

function removeEventListenerForHistoryItems() {
	for (let i = 0; i < historyItems.length; i++) {
		historyItems[i].removeEventListener('click', EventListenerForHistoryItem)
	}
}

function removeEventListenerForLinks() {
	for (let i = 0; i < linkItems.length; i++) {
		linkItems[i].removeEventListener('click', EventListenerForLink)
	}
}

function removeEventListenerForUnlinks() {
	for (let i = 0; i < unlinkItems.length; i++) {
		unlinkItems[i].removeEventListener('click', EventListenerForUnlink)
	}
}

document.querySelector('.weather__main-btn').addEventListener('click', e => {
	document.querySelector('.weather__main').style.display = "flex"
	document.querySelector('.weather__graph').style.display = "none"
})

document.querySelector('.weather__graph-btn').addEventListener('click', e => {
	document.querySelector('.weather__main').style.display = "none"
	document.querySelector('.weather__graph').style.display = "flex"
})

searchBtn.addEventListener('click', () => {
	getWeatherData(cityInput.value)
	getWeatherForWeek(cityInput.value)
})

let nightMode = true

switchDarkMode.addEventListener('click', e => {
	nightMode = switchDarkMode.checked
	getWeatherData(curCity)
	getWeatherForWeek(curCity)
})

document.addEventListener('mousemove', e => {
  const x = e.clientX; // Координата X курсора
  const y = e.clientY; // Координата Y курсора
  const body = document.querySelector('body')
document.querySelector('.ALL').style.left = `${(window.getComputedStyle(body).width.slice(0,-2)/2-x)/8}px`
document.querySelector('.ALL').style.top = `${(window.getComputedStyle(body).height.slice(0,-2)/2-y)/8}px`
document.querySelector('.ALL').style.transform = `scale(0.9) perspective(1000px) rotateX(${y/(window.getComputedStyle(body).height.slice(0,-2))*-10+5}deg) rotateY(${x/(window.getComputedStyle(body).width.slice(0,-2))*20-10}deg)`
})