import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formElement = document.querySelector('form.form');
const fieldSet = document.querySelector('form fieldset');
let delay = 0;
let isToBeFulfilled;
console.log(formElement.elements.state);

fieldSet.addEventListener('click', e => {
  isToBeFulfilled = e.target.value === 'fulfilled' ? true : false;
  console.log(isToBeFulfilled);
});

formElement.addEventListener('submit', e => {
  e.preventDefault();
  delay = Number.parseInt(formElement.elements.delay.value);
  const promise = new Promise((resolve, reject) => {
    console.log(delay);
    setTimeout(() => {
      if (isToBeFulfilled) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  })
    .then(value => {
      //console.log(value);
      iziToast.success({
        message: `✅ Fulfilled promise in ${value}ms`,
        position: 'topRight',
        icon: 'none',
      });
    })
    .catch(err => {
      //  console.log(err);
      iziToast.error({
        message: `❌ Rejected promise in ${err}ms`,
        position: 'topRight',
      });
    });
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
