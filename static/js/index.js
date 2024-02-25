function pageLoaded() {
  console.log('js ready');
  
  const shareButton = document.getElementById('share-btn');
  shareButton.addEventListener('click', function () {
    const readOnlyLink = window.location.origin + '/read_only.html';
    alert('Share this link with others to view your diary: \n\n' + readOnlyLink);
  });
  const clearButton = document.getElementById('clearbtn');
  clearButton.addEventListener('click', function (){
    clearCalendar();
    alert('All data from calendar was deleted')
  });
  document.getElementById('icon').addEventListener('click', openNav);
  document.getElementById('closeBtn').addEventListener('click', closeNav);
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const diaryEntryElement = document.getElementById('diaryEntry');

displayCalendar(currentMonth, currentYear);

function displayCalendar(month, year) {
  const daysInMonth = getDaysInMonth(month, year);
  const calendar = document.getElementById('calendar');
  var temp_year = year;
  var temp_month = month;

  // Clear calendar
  calendar.innerHTML = '';

  // Set calendar header
  const header = document.createElement('h2');

  header.innerHTML = getMonthName(month) + ' ' + year;
  header.id = 'calendar-header'
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
      cell.classList.add('currentDay');
      if ((i === 0 && j < new Date(year, month, 1).getDay()) || dayOfMonth > daysInMonth) {
        // Display empty cell for days before first currentDay of month or after last currentDay of month
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
    if (event.target.classList.contains('currentDay')) {
      const currentDay = event.target.innerHTML;
      const month = temp_month;
      const year = temp_year;

      // Remove selected class from previously selected currentDay
      const selectedDay = document.querySelector('.selected');
      if (selectedDay) {
        selectedDay.classList.remove('selected');
      }

      // Add selected class to selected currentDay
      event.target.classList.add('selected');

         // Construct the URL with query parameters
         const url = 'data?' +
         'year=' + encodeURIComponent(year) +
         '&month=' + encodeURIComponent(month) +
         '&day=' + encodeURIComponent(currentDay);

     // Redirect to the new page
     window.location.href = url;
    }
  });

  // Add buttons to change month
  const nextMonth = document.createElement('button');
  nextMonth.innerHTML = '<i class="fa fa-chevron-right"></i>';
  nextMonth.classList.add('calendar-btn');
  nextMonth.id = 'nextMonth';
  nextMonth.addEventListener('click', function () {
    temp_year = year;
    temp_month = month;
    if (month === 11) {
      displayCalendar(0, year + 1);
      temp_year = year + 1;
      
    } else {
      displayCalendar(month + 1, year);
      temp_month = month + 1;
    }

  });
  header.appendChild(nextMonth);

  const prevMonth = document.createElement('button');
  prevMonth.id = 'prevMonth';
  prevMonth.innerHTML = '<i class="fa fa-chevron-left"></i>';
  prevMonth.classList.add('calendar-btn');
  prevMonth.addEventListener('click', function () {
 
    if (month === 0) {
      displayCalendar(11, year - 1);
      temp_year = year - 1
    } else {
      displayCalendar(month - 1, year);
      temp_month = month - 1
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


// Utility functions
function clearCalendar() {
  // Assuming you have a Flask route to handle the clear_calendar function
  fetch('/clear_calendar')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // assuming server returns JSON
      })
      .then(data => {
          console.log(data);
          location.reload(true); // log the response from the server
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

function openNav() {
  document.getElementById('mySidenav').style.width = '250px';
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
}


pageLoaded();
