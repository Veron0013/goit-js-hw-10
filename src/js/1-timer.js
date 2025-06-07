// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

let userSelectedDate;
let timerId;
let intervalId;

const btnStart = document.querySelector(".button.start");
const btnStop = document.querySelector(".button.stop");
const inputField = document.querySelector(".input_field");

const classTypes = ["normal", "disabled"];

const timerCounter = document.querySelectorAll(".value");

function changeSelectorClass(selector, type) {

	//console.log(selector, type);
	selector.classList.remove(...classTypes);
	selector.classList.add(type);
}

const options = {
	enableTime: true,
	time_24hr: true,
	defaultDate: new Date(),
	minuteIncrement: 1,
	onChange(selectedDates) {
		if (selectedDates[0] > new Date()) {
			changeSelectorClass(btnStart, "normal");
		}
		else {
			changeSelectorClass(btnStart, "disabled");
		};
	},
	onClose(selectedDates) {
		userSelectedDate = selectedDates[0];
	},
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
	// Number of milliseconds per unit of time
	const second = 1000;
	const minute = second * 60;
	const hour = minute * 60;
	const day = hour * 24;

	// Remaining days
	const days = Math.floor(ms / day);
	// Remaining hours
	const hours = Math.floor((ms % day) / hour);
	// Remaining minutes
	const minutes = Math.floor(((ms % day) % hour) / minute);
	// Remaining seconds
	const seconds = Math.floor((((ms % day) % hour) % minute) / second);

	return { days, hours, minutes, seconds };
}

btnStart.addEventListener("click", (e) => {
	e.target.blur();

	changeSelectorClass(btnStop, "normal");
	changeSelectorClass(btnStart, "disabled");
	changeSelectorClass(inputField, "disabled");

	const timeDelta = userSelectedDate - new Date();
	//let timeToMs = convertMs(timeDelta);
	//console.log(timeDelta);
	//console.log(btnStop);


	timerId = setTimeout(() => {
		changeSelectorClass(btnStart, "normal");
		changeSelectorClass(inputField, "normal");
	}, timeDelta);

	intervalId = setInterval(() => {
		let ticker = userSelectedDate - new Date();
		let timeToMs = convertMs(ticker);

		timerCounter.forEach(el => {
			const keys = Object.keys(el.dataset);
			const key = keys[0];

			//console.log(key);
			//console.log(el);

			if (timeToMs[key] !== undefined) {
				el.textContent = String(timeToMs[key]).padStart(2, "0");
			}
		});

	}, 1000);

});

btnStop.addEventListener("click", (e) => {
	e.target.blur();
	changeSelectorClass(btnStop, "disabled");
	changeSelectorClass(btnStart, "normal");
	changeSelectorClass(inputField, "normal");

	if (intervalId) clearInterval(intervalId);
	if (timerId) clearTimeout(timerId);

	timerCounter.forEach(el => {
		el.textContent = "00";
	});

});