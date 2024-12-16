// Get references to DOM elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Add event listener to the form
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get task details
    const taskName = document.getElementById('task-name').value;
    const taskDeadline = document.getElementById('task-deadline').value;

    // Validate input
    if (taskName.trim() === '' || taskDeadline.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Create a new list item
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span>${taskName}</span> <em>Due: ${taskDeadline}</em>`;

    // Append to the task list
    taskList.appendChild(listItem);

    // Clear the form fields
    taskForm.reset();
});
