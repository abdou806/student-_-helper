document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const notificationContainer = document.getElementById('notification-container');

  // تحميل المهام المحفوظة من Local Storage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // دالة لتحديث Local Storage
  function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // دالة لإظهار إشعار
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerText = message;
    notificationContainer.appendChild(notification);

    // اختفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }

  // دالة لإضافة مهمة إلى القائمة
  function addTaskToList(task) {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <h3>${task.title} (${task.priority})</h3>
      <p>${task.desc}</p>
      <p>الوقت: ${task.time}</p>
      <p>التقدم: ${task.progress}%</p>
      <p>الوقت المتبقي: <span class="time-remaining">${calculateTimeRemaining(task.time)}</span></p>
      <button class="delete-btn">حذف</button>
    `;
    const deleteButton = taskItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function () {
      tasks.splice(tasks.indexOf(task), 1);
      taskItem.remove();
      updateLocalStorage();
    });
    taskList.appendChild(taskItem);
  }

  // دالة لحساب الوقت المتبقي للمهمة
  function calculateTimeRemaining(taskTime) {
    const taskDate = new Date(`1970-01-01T${taskTime}:00`);
    const now = new Date();
    const diff = taskDate - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ساعة و ${minutes} دقيقة`;
  }

  // دالة للتحقق من المهام التي يجب تنبيه المستخدم عنها
  function checkTaskTime() {
    const now = new Date();
    tasks.forEach(task => {
      const taskTime = new Date(`1970-01-01T${task.time}:00`);
      const timeDiff = taskTime - now;

      if (timeDiff < 600000 && timeDiff > 0) {
        showNotification(`الوقت المحدد لمهمة "${task.title}" اقترب.`);
      }
    });
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

    showNotification(`تم إضافة المهمة "${title}" بنجاح!`);
    taskForm.reset();
  });

  // التحقق من الوقت كل دقيقة
  setInterval(checkTaskTime, 60000); // التحقق كل دقيقة
});
