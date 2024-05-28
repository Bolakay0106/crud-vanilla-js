const API_URL = 'http://192.168.13.171:8001/api';

let allUsers = [];
document.addEventListener('DOMContentLoaded', () => {
	fetchUsers();
	document.getElementById("login-form").addEventListener("submit", handleFormSubmit);
});

function fetchUsers() {
	fetch(`${API_URL}/get/users`)
		.then(response => response.json())
		.then(data => {
			allUsers = [...data];
			renderUsers(allUsers);
		})
		.catch(error => console.error('Error fetching user data:', error));
}

function renderUsers(allUsers) {
	const dataDiv = document.getElementById('data');
	dataDiv.innerHTML = '';
	const table = document.createElement('table');
	table.classList.add('table', 'table-light', 'table-hover', 'table-bordered');
	table.innerHTML = `
                <thead class="thead-light">
                    <tr>
                        <th>Id</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Phone</th>
                        <th>Password</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    ${allUsers.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.full_name}</td>
                            <td>${user.email}</td>
                            <td>${user.username}</td>
                            <td>${user.phone}</td>
                            <td>${user.password}</td>
                            <td>${formatDate(user.created_at)}</td>
                            <td>${formatDate(user.updated_at)}</td>
                            <td>
                                <button onclick="editUser(${user.id})" class="edit-button btn btn-primary btn-sm">Edit</button>
                            </td>
                            <td>    
                                <button onclick="deleteUser(${user.id}, event)" class="delete-button btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
	dataDiv.appendChild(table);
}

function formatDate(dateString) {
	const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	return new Date(dateString).toLocaleString(undefined, options);
}

function handleFormSubmit(event) {
	event.preventDefault();

	const data = {
		full_name: event.target.full_name.value,
		email: event.target.email.value,
		username: event.target.username.value,
		phone: event.target.phone.value,
		password: event.target.password.value
	};

	if (event.target.user_id.value) {
		updateUser(event.target.user_id.value, data);
	} else {
		addUser(data);
	}
}

function addUser(data) {
	fetch(`${API_URL}/register`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})
		.then(response => response.json())
		.then(() => {
			alert('User added successfully');
			resetForm();
			fetchUsers();
		})
		.catch(error => console.error('Error adding user:', error));
}

function editUser(userId) {
	const selectedUser = allUsers.find((el) => el.id === userId)
	document.getElementById('login-button').textContent = 'Update User';
	document.getElementById('login-button').style.background = 'blue';
	document.getElementById('user_id').value = selectedUser.id;
	document.getElementById('full_name').value = selectedUser.full_name;
	document.getElementById('email').value = selectedUser.email;
	document.getElementById('username').value = selectedUser.username;
	document.getElementById('phone').value = selectedUser.phone;
	document.getElementById('password').value = selectedUser.password;
}

function updateUser(userId, data) {
	fetch(`${API_URL}/update/user/${userId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(() => {
			alert('User updated successfully');
			resetForm();
			fetchUsers();
		})
		.catch(error => console.error('Error updating user:', error));
}

function deleteUser(userId, event) {
	fetch(`${API_URL}/delete/user/${userId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})
		.then(response => {
			if (response.ok) {
				event.target.closest('tr').remove();
				alert('User deleted');
			} else {
				console.error('Error deleting user');
			}
		})
		.catch(error => console.error('Error deleting user:', error));
}

function resetForm() {
	document.getElementById("login-form").reset();
	document.getElementById('user_id').value = '';
	document.getElementById('login-button').textContent = 'Add User';
	isEditMode = false;
}

