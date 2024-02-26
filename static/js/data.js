function pageLoaded() {
    console.log('js ready');
    const shareButton = document.getElementById('share-btn');
    shareButton.addEventListener('click', function () {
      const readOnlyLink = window.location.origin + '/read_only.html';
      alert('Share this link with others to view your diary: \n\n' + readOnlyLink);
    });
    document.getElementById('icon').addEventListener('click', openNav);
    document.getElementById('closeBtn').addEventListener('click', closeNav);
  }
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const diaryEntryElement = document.getElementById('diaryEntry');
  
  
  const dataContainer = document.getElementById('data-container');
  const year = dataContainer.getAttribute('data-year');
  const month = dataContainer.getAttribute('data-month');
  const day = dataContainer.getAttribute('data-day')
  
  const date = new Date(year, month, day);

  displayDiaryEntry(date)


  function displayDiaryEntry(date) {
    diaryEntryElement.innerHTML = '';
    
    
    var year = date.getFullYear().toString(); // Get the last two digits of the year
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
    var day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
    var formattedDate = year + '-' + month + '-' + day;
  
    const header = document.getElementById('diary_header')
    header.innerHTML = date.toDateString();
  
    // Buttons
    const submitbtn = document.getElementById('submitbtn');
    submitbtn.addEventListener('click', function(){
      const customer_name = document.getElementById('customer_name');
      if(customer_name.value == ''){
        alert('Please choose a name.');
      }else{
        sendDataToFlask(formattedDate)
        location.reload();
      }
    });

    retrieveData(formattedDate)    
  }
  function processData(data){
    var container = document.getElementById('inputs_div');
      container.innerHTML = '';
      
      // Iterate through each object in the 'data' array
      data.forEach(function(object) {
          const rowContainer = document.createElement('div');
          rowContainer.id = rowContainer;

          const time = document.createElement('h2');
          
          time.textContent = object[0]+ ':00';
          rowContainer.appendChild(time);
          
          const customer = document.createElement('h4');
          customer.textContent = object[1];
          rowContainer.appendChild(customer);
          
          const description = document.createElement('h4');
          description.textContent = object[2];
          rowContainer.appendChild(description);
          
          const delete_button = document.createElement('btn');
          delete_button.className = 'main';
          var iconElement = document.createElement('i');
          iconElement.className = "fa-trash";
          delete_button.appendChild(iconElement);
          delete_button.addEventListener('click', function () {
            console.log(date, object[0]);
            deleteData(date, object[0]);
            location.reload();
          });
          rowContainer.appendChild(delete_button);

          // Append the object container to the main container
          container.appendChild(rowContainer);
          
      });
      console.log()
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
      customer_name: document.getElementById('customer_name').value,
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
        // Handle the result if needed
      })
      .catch(error => {
        console.error('Error:', error.message); // Log the error message
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
          return '';  // Return an empty string if the response is empty
        }
      })
    .then(data => {

      processData(data);
  })
    .catch(error => {
        // Handle any errors that occur during the fetch
        console.error('Error:', error);
    });
  
  pageLoaded();

}

function deleteData(date, time){
        
  const data = {

    date: date,
    time: time,
  };

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
  .then(data => {   
  })
}