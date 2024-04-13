function pageLoaded() {
    console.log('js ready');
  }
  
  const diaryEntryElement = document.getElementById('diaryEntry');
  const dataContainer = document.getElementById('data-container');
  const year = dataContainer.getAttribute('data-year');
  const month = dataContainer.getAttribute('data-month');
  const day = dataContainer.getAttribute('data-day')
  
  const date = new Date(year, month, day);
  let slots_taken = [];

  displayDiaryEntry(date);

  function displayDiaryEntry(date) {
    diaryEntryElement.innerHTML = '';
    
    var year = date.getFullYear().toString(); 
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var formattedDate = year + '-' + month + '-' + day;
  
    const header = document.getElementById('diary_header')
    header.innerHTML = date.toDateString();
  
    retrieveData(formattedDate);

    submit_booking(formattedDate);
  }
  
  function submit_booking(date){
    const submitbtn = document.getElementById('submitbtn');

    submitbtn.addEventListener('click', function(){
      const customer_name = document.getElementById('customer_name');
      const time = document.getElementById('time');
      if(customer_name.value == ''){
        alert('Please choose a customer.');
      }else{

        if(slots_taken.includes(time.value)){
          alert('Slot is already taken');
        }else{
        sendDataToFlask(date)
        }
      }
    });
  }

  function processData(data){
    var container = document.getElementById('customer_slots');
      container.innerHTML = '';
   
      const username = data.username;
      const user_input = document.getElementById('customer_name')

      if(username=='admin'){
        user_input.type = 'text'
        user_input.value = ''
      }

    if(data && data.data && typeof data.data[0] !== 'undefined') {

      for(i=0; i<=11; i++){
        if(data.data[i]){
          const cont = document.getElementById('s' + data.data[i][0]);
          const cont2 = document.createElement('p');
          cont2.classList.add('description')
          const delete_button = document.createElement('btn');
          delete_button.className = 'main';
          var iconElement = document.createElement('i');
          iconElement.textContent = 'x'
          delete_button.appendChild(iconElement);
          
          delete_button.addEventListener('click', (function(i) {
            return function() {
                deleteData(date, data.data[i][0]);
                
            };
        })(i));
          if(username == 'admin'){
            str = data.data[i][1]
            console.log(data.data[i])
            cont.textContent = str.charAt(0).toUpperCase() + str.slice(1);
            cont2.textContent = data.data[i][2];
            cont.appendChild(cont2);
            cont.appendChild(delete_button);
          
          }
          if(data.data[i][1] == username && username != 'admin'){
            cont.textContent = 'You';
            cont.style.backgroundColor = "purple";
            cont.appendChild(delete_button);
          }else{
            cont.style.backgroundColor = "rgb(243, 38, 38)";
          }
          slots_taken.push(data.data[i][0]);


        }
      }
    }
  }
  // Utility functions
  
  function createInput(id, content, placeholder) {
    const input = document.createElement('textarea');
    input.id = id;
    input.textContent = content;
    input.placeholder = placeholder;
    diaryEntryElement.appendChild(input);
  }
  
  function openNav() {
    document.getElementById('mySidenav').style.width = '250px';
  }
  
  function closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }
  
  // APIS
  
  function sendDataToFlask(date) {
    const data = {
      page_title: document.getElementById('page_heading').innerHTML,
      date: date,
      user_id: document.getElementById('customer_name').value,
      customer_id: document.getElementById('customer_name').value,
      description: document.getElementById('description').value,
      time: document.getElementById('time').value,
    };
  
    fetch('/insert_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then(result => {
        if (result.status === "success"){

          location.reload();
          alert('You successfully booked your session. We are looking forward to see you.')
        
        }
      })
      .catch(error => {
        alert('Customer does not exist')
      });
  }
  
  function retrieveData(date){
    date = date
    fetch('/retrieve_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'date': date,  // Replace with the actual date or get it dynamically
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
    
      processData(data);
  })
    .catch(error => {
  
    });
  
  pageLoaded();

}

function deleteData(date, time) {
  const isoDateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${('0' + time).slice(-2)}:00:00`;
  const data = {
    date: isoDateString,
    time: time,
    text: 'message',
  };
  console.log(date);
  fetch('/delete_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {
      console.log('Delete operation successful:', responseData);
      location.reload()
      
    })
    .catch(error => {
    });
}


