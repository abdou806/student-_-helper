// فئة إدارة المهام
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.initializeEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    // تهيئة مستمعي الأحداث
    initializeEventListeners() {
        document.getElementById('add-task-btn').addEventListener('click', () => this.addTask());
        
        // مستمعو أحداث الفلترة
        document.getElementById('filter-category').addEventListener('change', () => this.renderTasks());
        document.getElementById('filter-priority').addEventListener('change', () => this.renderTasks());
    }

    // إضافة مهمة جديدة
    addTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const priority = document.getElementById('task-priority').value;
        const deadline = document.getElementById('task-deadline').value;
        const category = document.getElementById('task-category').value;
        const tags = document.getElementById('task-tags').value.split(',').map(tag => tag.trim());

        if (!title || !deadline || !priority || !category) {
            alert('يرجى ملء الحقول الإلزامية');
            return;
        }

        const task = {
            id: Date.now(),
            title,
            description,
            priority,
            deadline,
            category,
            tags,
            completed: false
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.resetForm();
        this.setupTaskReminders();
    }

    // عرض المهام
    renderTasks() {
        const container = document.getElementById('tasks-container');
        const categoryFilter = document.getElementById('filter-category').value;
        const priorityFilter = document.getElementById('filter-priority').value;

        container.innerHTML = '';

        const filteredTasks = this.tasks.filter(task => 
            (!categoryFilter || task.category === categoryFilter) &&
            (!priorityFilter || task.priority === priorityFilter)
        );

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item', `priority-${task.priority}`);
            taskElement.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <div class="task-metadata">
                        <span>الموعد: ${this.formatDate(task.deadline)}</span>
                        <span>الفئة: ${task.category}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button onclick="taskManager.toggleTaskStatus(${task.id})">
                        ${task.completed ? 'إلغاء الإنجاز' : 'تم الإنجاز'}
                    </button>
                    <button onclick="taskManager.deleteTask(${task.id})">حذف</button>
                </div>
            `;
            container.appendChild(taskElement);
        });
    }

    // تحديث حالة المهمة
    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        task.completed = !task.completed;
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    // حذف مهمة
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    // حفظ المهام
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // إعداد التذكيرات
    setupTaskReminders() {
        this.tasks.forEach(task => {
            const taskTime = new Date(task.deadline);
            const currentTime = new Date();

            if (taskTime > currentTime) {
                const timeDiff = taskTime - currentTime;
                setTimeout(() => {
                    this.showNotification(task);
                }, timeDiff);
            }
        });
    }

    // عرض الإشعارات
    showNotification(task) {
        if (Notification.permission === 'granted') {
            new Notification(`حان موعد مهمتك: ${task.title}`, {
                body: `الموعد: ${this.formatDate(task.deadline)}`,
                icon: 'task-icon.png'
            });
        }
    }

    // تنسيق التاريخ
    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    }

    // إعادة تعيين النموذج
    resetForm() {
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-priority').value = '';
        document.getElementById('task-deadline').value = '';
        document.getElementById('task-category').value = '';
        document.getElementById('task-tags').value = '';
    }

    // تحديث الإحصائيات
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        document.getElementById('total-tasks').querySelector('.stat-number').textContent = totalTasks;
        document.getElementById('completed-tasks').querySelector('.stat-number').textContent = completedTasks;
        document.getElementById('pending-tasks').querySelector('.stat-number').textContent = pendingTasks;
    }
}

// تهيئة مدير المهام
const taskManager = new TaskManager();

// إعداد الإشعارات
window.addEventListener('load', () => {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
    
    // تحديث المهام والإحصائيات عند التحميل
    taskManager.renderTasks();
    taskManager.updateStats();
    taskManager.setupTaskReminders();
});
