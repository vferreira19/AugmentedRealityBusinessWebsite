function pageLoaded() {
  console.log('js ready');
  document.getElementById('icon').addEventListener('click', openNav);
  document.getElementById('closeBtn').addEventListener('click', closeNav);
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const diaryEntryElement = document.getElementById('diaryEntry');
const services = []
retrieveData();
get_dates();

function addService(){
    const input = document.getElementById('new-service')
    insert_service(input.value)
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthName(month) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[month];
}

function displayCalendar(month, year) {
  const daysInMonth = getDaysInMonth(month, year);
  const calendar = document.getElementById('calendar');
  var temp_year = year;
  var temp_month = month;
  calendar.innerHTML = '';
  
  const header = document.createElement('h2');
  header.innerHTML = getMonthName(month) + ' ' + year;
  header.id = 'calendar-header'
  calendar.appendChild(header);

  
  const table = document.createElement('table');
  calendar.appendChild(table);


  const row = document.createElement('tr');
  table.appendChild(row);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < weekdays.length; i++) {
    const cell = document.createElement('td');
    cell.innerHTML = weekdays[i];
    row.appendChild(cell);
  }
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
  addEventListener('touchstart', function (event) {
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

function countServices(services) {
  const serviceCount = {};
  services.forEach(service => {
    serviceCount[service] = (serviceCount[service] || 0) + 1;
  });
  return serviceCount;
}

function drawChart(services){


  const serviceCount = countServices(services);
  const labels = Object.keys(serviceCount);
  const data = Object.values(serviceCount);

  // Initialize Chart
  const ctx = document.getElementById('servicesChart').getContext('2d');
  const servicesChart = new Chart(ctx, {
    type: 'bar', // You can change this to 'pie', 'line', etc. depending on your preference
    data: {
      labels: labels,
      datasets: [{
        label: 'orders',
        data: data,
        backgroundColor: 'rgb(28, 136, 229)', // Adjust colors as needed
        borderColor: 'rgb(28, 136, 229)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          display: false
        }
      },
      plugins: {
        legend: {
          display: false // Remove legend labels
        }
      }
    }
  });
}

function drawChart2(dates, frequencies){

    // Initialize a new Chart.js chart
    var ctx = document.getElementById('datesChart').getContext('2d');
    var datesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Frequency',
          data: frequencies,
          backgroundColor: 'rgb(28, 136, 229)', // Adjust color as needed
          borderColor: 'rgb(28, 136, 229)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            display: false
          }
        },
        plugins: {
          legend: {
            display: false // Remove legend labels
          }
        }
      }
    });
  }
displayCalendar(currentMonth, currentYear);

function openNav() {
  document.getElementById('mySidenav').style.width = '250px';
}
function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
}
function retrieveData(){
  
  fetch('/get_services', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
            // Replace with the actual date or get it dynamically
      }),
  })
  .then(response => {
      
      if (response.ok && response.headers.get('content-length') !== '0') {
        return response.json();
      } else {
        return ''; 
      }
    })
  .then(data => {

    for (i in data.data){
      if(data.data[i] != ''){
      services.push(data.data[i])
    }}
    drawChart(services);

})
  .catch(error => {

  });



}
function get_dates(){
  
  fetch('/get_dates', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
            // Replace with the actual date or get it dynamically
      }),
  })
  .then(response => {
      
      if (response.ok && response.headers.get('content-length') !== '0') {
        return response.json();
      } else {
        return ''; 
      }
    })
  .then(data => {
    const dates = data.data.dates
    const frequencies = data.data.frequencies
    drawChart2(dates, frequencies)

})
  .catch(error => {

  });



}

function insert_service(service){
  data = {
    'service': service
  }
  fetch('/insert_service', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => {
    })
  .then(data => {
      location.reload()
})
  .catch(error => {
    console.error('Error:', error);
  });



}
pageLoaded();
