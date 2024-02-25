function pageLoaded() {
  console.log('js ready');
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const diaryEntryElement = document.getElementById('diaryEntry');

displayCalendar(currentMonth, currentYear);

function displayCalendar(month, year) {
  const daysInMonth = getDaysInMonth(month, year);
  const calendar = document.getElementById('calendar');

  // Clear calendar
  calendar.innerHTML = '';

  // Set calendar header
  const header = document.createElement('h2');

  header.innerHTML = getMonthName(month) + ' ' + year;
  calendar.appendChild(header);

  // Create table for calendar
  const table = document.createElement('table');
  calendar.appendChild(table);

  // Create table header with weekday names
  const row = document.createElement('tr');
  table.appendChild(row);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < weekdays.length; i++) {
    const cell = document.createElement('td');
    cell.innerHTML = weekdays[i];
    row.appendChild(cell);
  }

  // Fill table with days of month
  let dayOfMonth = 1;
  for (let i = 0; i < 6; i++) {
    const rowElement = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      cell.classList.add('day');
      if ((i === 0 && j < new Date(year, month, 1).getDay()) || dayOfMonth > daysInMonth) {
        // Display empty cell for days before first day of month or after last day of month
        cell.classList.add('disabled');
      } else {
        cell.innerHTML = dayOfMonth;
        if (dayOfMonth === new Date().getDate() && month === currentMonth && year === currentYear) {
          // Add today class to today's cell
          cell.classList.add('today');
        }
        dayOfMonth++;
      }
      rowElement.appendChild(cell);
    }
    table.appendChild(rowElement);
  }
  addEventListener('click', function (event) {
    if (event.target.classList.contains('day')) {
      const day = event.target.innerHTML;
      const month = currentMonth;
      const year = currentYear;
      // Remove selected class from previously selected day
      const selectedDay = document.querySelector('.selected');
      if (selectedDay) {
        selectedDay.classList.remove('selected');
      }
      // Add selected class to selected day
      event.target.classList.add('selected');
      // Update diary entry for selected date
      const date = new Date(year, month, day);

      displayDiaryEntry(date);
    }
  });

  // Add buttons to change month
  const nextMonth = document.createElement('button');
  nextMonth.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextMonth.classList.add('calendar-btn');
  nextMonth.id = 'nextMonth';
  nextMonth.addEventListener('click', function () {
    if (month === 11) {
      displayCalendar(0, year + 1);
    } else {
      displayCalendar(month + 1, year);
    }
  });
  header.appendChild(nextMonth);


  const prevMonth = document.createElement('button');
  prevMonth.id = 'prevMonth';
  prevMonth.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevMonth.classList.add('calendar-btn');
  prevMonth.addEventListener('click', function () {
    if (month === 0) {
      displayCalendar(11, year - 1);
    } else {
      displayCalendar(month - 1, year);
    }
  });
  header.appendChild(prevMonth);
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthName(month) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[month];
}

function displayDiaryEntry(date) {
  diaryEntryElement.innerHTML = '';
  const day = date.getDate();


  // Date
  const header = document.createElement('h2');
  header.id = 'diary_header';
  header.innerHTML = date.toDateString();
  diaryEntryElement.appendChild(header);

  // Input
  let inputOneValue = 'NO DATA';
  let inputTwoValue = '';
  let inputThreeValue = '';

  // Get stored values and set input values
  const storedArr = JSON.parse(get(day));
  if (storedArr && storedArr.length === 3) {
    inputOneValue = storedArr[0];
    inputTwoValue = storedArr[1];
    inputThreeValue = storedArr[2];
  }

  const para1 = document.createElement('p');
  para1.innerHTML = inputOneValue;
  diaryEntryElement.appendChild(para1);
  const para2 = document.createElement('p');
  para2.innerHTML = inputTwoValue;
  diaryEntryElement.appendChild(para2);
  const para3 = document.createElement('p');
  para3.innerHTML = inputThreeValue;
  diaryEntryElement.appendChild(para3);

  createButton('print', 'Print', popuponclick, [date, inputOneValue, inputTwoValue, inputThreeValue]);
}

function popuponclick(date, input1, input2, input3) {
  const myWindow = window.open('', '', window);

  const heading = myWindow.document.createElement('h1');
  heading.textContent = date.toDateString();

  const data1 = myWindow.document.createElement('p');
  data1.innerHTML = `<h3>Work carried out</h3>${input1}`;

  const data2 = myWindow.document.createElement('p');
  data2.innerHTML = `<h3>Knowledge/Experience gained</h3>${input2}`;

  const data3 = myWindow.document.createElement('p');
  data3.innerHTML = `<h3>Competency</h3>${input3}`;

  myWindow.document.body.appendChild(heading);
  myWindow.document.body.appendChild(data1);
  myWindow.document.body.appendChild(data2);
  myWindow.document.body.appendChild(data3);
}

// Utility functions

function createButton(id, content, onclickFunc, onclickParams) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.innerHTML = content;
  btn.addEventListener('click', function () {
    if (Array.isArray(onclickParams)) {
      onclickFunc(...onclickParams);
    } else {
      onclickFunc(onclickParams);
    }
  });
  diaryEntryElement.appendChild(btn);
}

// Local Storage Functions

function get(day) {
  return localStorage.getItem(day);
}

pageLoaded();
