import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const btn_snackbar = document.querySelector(".btn_snackbar");
const input_delay = document.querySelector(".input_delay");


btn_snackbar.addEventListener("click", (e) => {
	e.preventDefault();

	const delayMS = Number(input_delay.value);
	const selected = document.querySelector('.radio_snackbar:checked');

	//console.log(selected);

	if (delayMS > 0) {
		const isSuccess = selected.value === "fulfilled";

		const promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				if (isSuccess) {
					resolve(`Fulfilled promise in ${delayMS} ms`);
				} else {
					reject(`Rejected promise in ${delayMS} ms`);
				}
			}, delayMS);
		});

		promise
			.then(value => {
				iziToast.show({
					message: value,
					messageColor: 'white',
					color: '#59a10d',
					position: 'topRight',
					iconUrl: '/img/success.svg',
				});
			})
			.catch(error => {
				iziToast.show({
					message: error,
					messageColor: 'white',
					color: '#ef4040',
					position: 'topRight',
					iconUrl: '/img/error.svg',
				});
			});
	}
})