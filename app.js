document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // طلب الإذن للإشعارات
  if ('Notification' in window) {
    Notification.requestPermission();
  }

  function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function addTaskToList(task) {
    const taskItem = document.createElement('li');
    taskItem.dataset.priority = task.priority;
    taskItem.innerHTML = `
      <h3>${task.title} (${task.priority})</h3>
      <p>${task.desc}</p>
      <p>الوقت: ${task.time}</p>
      <p>التقدم: ${task.progress}%</p>
      <p class="countdown"></p>
      <button class="delete-btn">حذف</button>
    `;

    const countdownElem = taskItem.querySelector('.countdown');
    const deleteButton = taskItem.querySelector('.delete-btn');

    deleteButton.addEventListener('click', function () {
      tasks.splice(tasks.indexOf(task), 1);
      taskItem.remove();
      updateLocalStorage();
    });

    // تحديث العد التنازلي
    const taskTime = new Date();
    [taskTime.setHours(task.time.split(':')[0]), taskTime.setMinutes(task.time.split(':')[1])];

    function updateCountdown() {
      const now = new Date();
      const diff = taskTime - now;

      if (diff > 0) {
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        countdownElem.textContent = `الوقت المتبقي: ${hours} ساعة و ${minutes} دقيقة`;
      } else {
        countdownElem.textContent = `حان وقت المهمة!`;
        clearInterval(countdownInterval);

        // إرسال إشعار
        if (Notification.permission === 'granted') {
          new Notification('تذكير بالمهمة', {
            body: `حان وقت المهمة: ${task.title}`,
          });
        }

        // تشغيل صوت
        const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
        audio.play();
      }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    taskList.appendChild(taskItem);
  }

  tasks.forEach(addTaskToList);

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
