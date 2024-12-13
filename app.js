document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');

  // تحميل المهام المحفوظة من Local Storage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // دالة لتحديث Local Storage
  function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // دالة لإضافة مهمة إلى القائمة
  function addTaskToList(task) {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <h3>${task.title} (${task.priority})</h3>
      <p>${task.desc}</p>
      <p>الوقت: ${task.time}</p>
      <p>التقدم: ${task.progress}%</p>
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
document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');

  // تحميل المهام المحفوظة من Local Storage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // دالة لتحديث Local Storage
  function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // دالة لإضافة مهمة إلى القائمة
  function addTaskToList(task) {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <h3>${task.title} (${task.priority})</h3>
      <p>${task.desc}</p>
      <p>الوقت: ${task.time}</p>
      <p>التقدم: ${task.progress}%</p>
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

  // إضافة التنبيه عند وقت المهمة
  const alertSound = document.createElement('audio');
  alertSound.src = 'alert.mp3'; // تأكد من وجود ملف alert.mp3 في نفس المسار
  alertSound.preload = 'auto';
  document.body.appendChild(alertSound);

  function checkTaskTimes() {
    const now = new Date();

    tasks.forEach((task) => {
      const taskTime = new Date();
      const [hours, minutes] = task.time.split(':');
      taskTime.setHours(hours, minutes, 0, 0);

      if (
        now.getHours() === taskTime.getHours() &&
        now.getMinutes() === taskTime.getMinutes()
      ) {
        alertSound.play();
        if (Notification.permission === 'granted') {
          new Notification('وقت المهمة!', {
            body: `المهمة: ${task.title}\nالأولوية: ${task.priority}`,
          });
        }
      }
    });
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  setInterval(checkTaskTimes, 60000); // يفحص كل دقيقة
});
