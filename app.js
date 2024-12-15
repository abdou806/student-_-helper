document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');

  // تحميل المهام المحفوظة من Local Storage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // دالة لتحديث Local Storage
  function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // دالة لحساب الوقت المتبقي
  function calculateTimeLeft(time) {
    const taskTime = new Date(`1970-01-01T${time}:00Z`);
    const currentTime = new Date();
    const timeDiff = taskTime - currentTime;

    if (timeDiff <= 0) {
      return "انتهت";
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} ساعة و ${minutes} دقيقة`;
  }

  // دالة لإضافة مهمة إلى القائمة
  function addTaskToList(task) {
    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-priority', task.priority);
    taskItem.innerHTML = `
      <h3>${task.title} (${task.priority})</h3>
      <p>${task.desc}</p>
      <p>الوقت: ${task.time}</p>
      <p>التقدم: ${task.progress}%</p>
      <p>الوقت المتبقي: ${calculateTimeLeft(task.time)}</p>
      <button class="delete-btn">حذف</button>
    `;
    
    // إذا كانت المهمة قد اقتربت من الانتهاء أو انتهت
    const timeLeft = calculateTimeLeft(task.time);
    if (timeLeft === "انتهت") {
      taskItem.classList.add("notification");
    }

    const deleteButton = taskItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function () {
      tasks.splice(tasks.indexOf(task), 1);
      taskItem.remove();
      updateLocalStorage();
    });

    taskList.appendChild(taskItem);
  }

  // عرض المهام المحفوظة عند تحميل الصفحة
  tasks.forEach(addTaskToList);

  // إضافة مهمة جديدة
  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const time = document.getElementById('task-time').value;
    const priority = document.getElementById('task-priority').value;
    const progress = document.getElementById('task-progress').value;

    const newTask = { title, desc, time, priority, progress };
    tasks.push(newTask);

    addTaskToList(newTask);
    updateLocalStorage();

    taskForm.reset();
  });
});
