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
    // header.innerHTML = date.toDateString();
    

  
  
    // Buttons
    const submitbtn = document.getElementById('submitbtn');
    submitbtn.addEventListener('click', function(){
        sendDataToFlask(formattedDate)
    });

    const removebtn = document.getElementById('removebtn');
    removebtn.addEventListener('click', function() {
        deleteData(formattedDate)
    });
   
    // const clearbtn = document.getElementById('clearbtn');
    // clearbtn.addEventListener('click', function() {
    //     clearCalendar()
    // });

  
    retrieveData(formattedDate)
    
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
      work_description: document.getElementById('work_description').value,
      experience_description: document.getElementById('experience_description').value,
      competency: document.getElementById('competency').value,
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
        // Handle the retrieved data here
        if (data.length >= 3) {
          document.getElementById('work_description').value = data[0];
          document.getElementById('experience_description').value = data[1];
          document.getElementById('competency').value = data[2];
        } else {
          document.getElementById('work_description').value = '';
          document.getElementById('experience_description').value = '';
          document.getElementById('competency').value = '';
        }
  
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }
  
  function deleteData(date){
        
    const data = {
  
      date: date,
  
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

  
  
  pageLoaded();
  