function pageLoaded(){

}

const table = document.getElementById('table');

retrieveData();

function retrieveData(){
    username = 'Vitor'
    fetch('/my_bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'username': username,
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
      
      console.log(data.data)
      console.log(data.data[0][0])
      for (i=0; i < data.data.length; i++){
        
        const time = data.data[i][1]
        const date = data.data[i][2]
        const description = data.data[i][3]
        
        const row = table.insertRow();

        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        const cell3= row.insertCell();


        cell1.textContent = time + ':00';
        cell2.textContent = date.slice(0,16);
        cell3.textContent = description;
    }
  })
    .catch(error => {
        console.error('Error:', error);
    });
  
  pageLoaded();

}