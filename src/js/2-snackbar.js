import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formElement = document.querySelector('form.form');
const checkedRadio = document.querySelector('input[type="radio"]:checked');

formElement.addEventListener('submit', e => {
  e.preventDefault();

  const selection = checkedRadio.value;
  const delay = Number.parseInt(formElement.elements.delay.value);
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selection === 'fulfilled') {
        resolve(delay);
      } else if(selection === 'rejected') {
        reject(delay);
      }
    }, delay);
  })
    .then(value => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${value} ms`,
        position: 'topRight',
        icon: 'none',
      });
    })
    .catch(err => {
      iziToast.error({
        message: `❌ Rejected promise in ${err} ms`,
        position: 'topRight',
        icon: 'none',
      });
    });
  return promise;
});

/*
Напиши скрипт, який після сабміту форми створює проміс. В середині колбека цього промісу через вказану користувачем кількість мілісекунд проміс має виконуватися (при fulfilled) або відхилятися (при rejected), залежно від обраної опції в радіокнопках. Значенням промісу, яке передається як аргумент у методи resolve/reject, має бути значення затримки в мілісекундах.

Створений проміс треба опрацювати у відповідних для вдалого/невдалого виконання методах.

Якщо проміс виконується вдало, виводь у консоль наступний рядок, де delay — це значення затримки виклику промісу в мілісекундах.



`✅ Fulfilled promise in ${delay}ms`



Якщо проміс буде відхилено, то виводь у консоль наступний рядок, де delay — це значення затримки промісу в мілісекундах.

`❌ Rejected promise in ${delay}ms`




На що буде звертати увагу ментор при перевірці:

Підключена бібліотека iziToast.
При обранні стану в радіокнопках і натисканні на кнопку Create notification з’являється повідомлення, відповідного до обраного стану стилю, із затримкою в кількість мілісекунд, переданих в інпут.
Повідомлення, що виводиться, містить тип обраного стейту і кількість мілісекунд згідно з шаблоном в умові.

*/
