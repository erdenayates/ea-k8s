// Fetch the user data from the backend
axios.get('http://34.72.124.34:3000/users')
  .then(response => {
    // Populate the table with the user data
    const userTable = document.getElementById('user-table');

    response.data.forEach(user => {
      const row = userTable.insertRow();
      row.insertCell().textContent = user.name;
      row.insertCell().textContent = user.email;
      row.insertCell().textContent = user.age;
    });
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
  });