import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const refs = {
  dateTimePicker: document.querySelector('input#datetime-picker'),
  dataStart: document.querySelector('button[data-start]'),
  dataPoints: document.querySelectorAll('div.timer span.value'),
  result: 0,
  copy: 0,
  intervalId: null,
  timeoutId: null,
};

let userSelectedDate;

refs.dataStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  locale: {
    firstDayOfWeek: 1,
  },
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      iziToast.error({
        backgroundColor: '#ef4040',
        class: 'error-message',
        title: 'Error',
        titleColor: '#fff',
        titleSize: '16px',
        titleLineHeight: 1.5,
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        messageSize: '16px',
        messageLineHeight: 1.5,
        position: 'topRight',
        iconUrl: '/img/x-octagon.svg',
      });
      // iziToast.show({
      //   title: 'Error',
      //   titleColor: '#fff',
      //   titleSize: '16px',
      //   message: 'Please choose a date in the future',
      //   messageColor: '#fff',

      //
      //   position: 'topRight',
      // });
      refs.dataStart.disabled = true;
    } else if (selectedDates[0] > new Date()) {
      refs.dataStart.disabled = false;
      userSelectedDate = new Date(selectedDates[0]);

      // console.log(userSelectedDate.getTime());
    }
  },
};

const calendar = flatpickr(refs.dateTimePicker, options);

const addLeadingZero = value => String(value).padStart(2, '0');

const timeCount = () => {
  const today = new Date();
  let msResult = userSelectedDate.getTime() - today.getTime();
  const result = convertMs(msResult);
  Array.from(refs.dataPoints).forEach(
    dataPoint =>
      (dataPoint.textContent = addLeadingZero(
        result[dataPoint.nextElementSibling.textContent.toLowerCase()]
      ))
  );
};

refs.dataStart.addEventListener('click', () => {
  refs.dataStart.disabled = true;
  refs.dateTimePicker.disabled = true;
  timeCount();
  const today = new Date();
  const todayMs = today.getTime();
  const end = userSelectedDate.getTime();
  let i = Math.floor((end - todayMs) / 1000);
  refs.intervalId = setInterval(function () {
    i--;
    if (i === 0) {
      refs.dateTimePicker.disabled = false;
      clearInterval(refs.intervalId);
    } else {
      timeCount();
    }
  }, 1000);
});

/*
Вибір дати



Метод onClose() з об'єкта параметрів викликається щоразу під час закриття елемента інтерфейсу, який створює flatpickr. Саме в ньому варто обробляти дату, обрану користувачем. Параметр selectedDates — це масив обраних дат, тому ми беремо перший елемент selectedDates[0].



Тобі ця обрана дата буде потрібна в коді і поза межами цього методу onClose(). Тому оголоси поза межами методу let змінну, наприклад, userSelectedDate, і після валідації її в методі onClose() на минуле/майбутнє запиши обрану дату в цю let змінну.

Якщо користувач вибрав дату в минулому, покажи window.alert() з текстом "Please choose a date in the future" і зроби кнопку «Start» не активною.
Якщо користувач вибрав валідну дату (в майбутньому), кнопка «Start» стає активною.
Кнопка «Start» повинна бути неактивною доти, доки користувач не вибрав дату в майбутньому. Зверни увагу, що при обранні валідної дати, не запуску таймера і обранні потім невалідної дати, кнопка після розблокування має знову стати неактивною.
Натисканням на кнопку «Start» починається зворотний відлік часу до обраної дати з моменту натискання.


Відлік часу



Натисканням на кнопку «Start» скрипт повинен обчислювати раз на секунду, скільки часу залишилось до вказаної дати, і оновлювати інтерфейс таймера, показуючи чотири цифри: дні, години, хвилини і секунди у форматі xx:xx:xx:xx.

Кількість днів може складатися з більше, ніж двох цифр.
Таймер повинен зупинятися, коли дійшов до кінцевої дати, тобто залишок часу дорівнює нулю 00:00:00:00.


Після запуску таймера натисканням кнопки Старт кнопка Старт і інпут стають неактивним, щоб користувач не міг обрати нову дату, поки йде відлік часу. Після зупинки таймера інпут стає активним, щоб користувач міг обрати наступну дату. Кнопка залишається не активною.


Для підрахунку значень використовуй готову функцію convertMs, де ms — різниця між кінцевою і поточною датою в мілісекундах.
Форматування часу



Функція convertMs() повертає об'єкт з розрахованим часом, що залишився до кінцевої дати. Зверни увагу, що вона не форматує результат. Тобто якщо залишилося 4 хвилини або будь-якої іншої складової часу, то функція поверне 4, а не 04. В інтерфейсі таймера необхідно додавати 0, якщо в числі менше двох символів. Напиши функцію, наприклад addLeadingZero(value), яка використовує метод рядка padStart() і перед відмальовуванням інтерфейсу форматує значення.



Бібліотека повідомлень



Для відображення повідомлень користувачеві, замість window.alert(), використовуй бібліотеку iziToast. Для того щоб підключити CSS код бібліотеки в проєкт, необхідно додати ще один імпорт, крім того, що описаний у документації.

При першому завантаженні сторінки кнопка Start не активна.
При кліку на інпут відкривається календар, де можна вибрати дату.
При обранні дати з минулого, кнопка Start стає неактивною і з’являється повідомлення з текстом "Please choose a date in the future".
При обранні дати з майбутнього кнопка Start стає активною.
При натисканні на кнопку Start вона стає неактивною, на сторінку виводиться час, що лишився до обраної дати у форматі xx:xx:xx:xx, і запускається зворотний відлік часу до обраної дати.
Кожну секунду оновлюється інтерфейс і показує оновлені дані часу, який залишився.
Таймер зупиняється, коли доходить до кінцевої дати, тобто залишок часу дорівнює нулю і інтерфейс виглядає так 00:00:00:00.
Час в інтерфейсі відформатований і, якщо воно містить менше двох символів, на початку числа доданий 0
*/
