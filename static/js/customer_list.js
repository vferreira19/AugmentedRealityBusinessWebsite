function pageLoaded(){

}

const table = document.getElementById('table');





retrieveData();



function retrieveData(date){
    date = date
    fetch('/get_users', {
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

        for (i=0; i < data.data.length; i++){
            const id = data.data[i][0]
            const name = data.data[i][1]
            const phone = data.data[i][3]
            const email = data.data[i][4]
            

            const row = table.insertRow();

            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3= row.insertCell();
            const cell4 = row.insertCell();

            cell1.textContent = id;
            cell2.textContent = name;
            cell3.textContent = phone;
            cell4.textContent = email;
        }
  })
    .catch(error => {
        console.error('Error:', error);
    });
  
  pageLoaded();

}