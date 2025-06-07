import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = -1;
let timerId;
let intervalId;

const btnStart = document.querySelector(".button.start");
const btnStop = document.querySelector(".button.stop");
const inputField = document.querySelector(".input_field");
const timerCounter = document.querySelectorAll(".value");

const classTypes = ["normal", "disabled"];

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
		if (selectedDates[0] <= new Date()) {
			iziToast.show({
				id: 'error',
				title: 'Error',
				message: "Please choose a date in the future",
				messageColor: 'white',
				color: '#ef4040',
				position: 'topCenter',
				//iconUrl: './img/error.svg',
			});
		}
	},
};

flatpickr("#datetime-picker", options);

function changeSelectorClass(selector, type) {

	//console.log(selector, type);
	selector.classList.remove(...classTypes);
	selector.classList.add(type);
}

function addLeadingZero(value) {
	return String(value).padStart(2, "0");
}

function stopTimerInterval() {
	if (intervalId) clearInterval(intervalId);
	if (timerId) clearTimeout(timerId);

	const timeDelta = userSelectedDate - new Date();

	changeSelectorClass(btnStop, "disabled");
	changeSelectorClass(btnStart, timeDelta > 0 ? "normal" : "disabled");
	changeSelectorClass(inputField, "normal");

	timerCounter.forEach(el => {
		el.textContent = "00";
	});

}

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

		stopTimerInterval();
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
				el.textContent = addLeadingZero(timeToMs[key]);
			}
		});

	}, 1000);

});

btnStop.addEventListener("click", (e) => {
	e.target.blur();
	stopTimerInterval();
});