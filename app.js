// التعامل مع رفع الملاحظات
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('file').files[0];
    const description = document.getElementById('description').value;

    if (!file) {
        alert('يرجى اختيار ملف لتحميله.');
        return;
    }

    // إنشاء نموذج FormData لرفع الملف
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('category', category);
    formData.append('file', file);
    formData.append('description', description);

    // إرسال الطلب باستخدام AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php', true);  // هنا يجب تعديل رابط الخادم (مثل PHP أو Node.js)
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert('تم رفع الملاحظة بنجاح!');
            loadNotes(); // تحميل الملاحظات المحدثة
        } else {
            alert('حدث خطأ أثناء رفع الملاحظة.');
        }
    };
    xhr.send(formData);
});

// تحميل الملاحظات
function loadNotes() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'notes.json', true);  // هذا الملف يمكن أن يكون JSON يتضمن جميع الملاحظات
    xhr.onload = function() {
        if (xhr.status === 200) {
            const notes = JSON.parse(xhr.responseText);
            displayNotes(notes);
        }
    };
    xhr.send();
}

// عرض الملاحظات
function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = ''; // مسح القائمة الحالية

    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.setAttribute('data-category', note.category.toLowerCase());

        const noteTitle = document.createElement('h3');
        noteTitle.textContent = note.subject;
        noteDiv.appendChild(noteTitle);

        const noteCategory = document.createElement('p');
        noteCategory.textContent = `التصنيف: ${note.category}`;
        noteDiv.appendChild(noteCategory);

        const noteDescription = document.createElement('p');
        noteDescription.textContent = note.description || 'لا يوجد وصف للملاحظة.';
        noteDiv.appendChild(noteDescription);

        const downloadLink = document.createElement('a');
        downloadLink.href = note.fileUrl;
        downloadLink.download = note.fileName;
        downloadLink.textContent = 'تحميل الملف';
        noteDiv.appendChild(downloadLink);

        notesList.appendChild(noteDiv);
    });
}

// فلترة الملاحظات بناءً على البحث
function filterNotes() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const notes = document.querySelectorAll('.note');

    notes.forEach(note => {
        const noteTitle = note.querySelector('h3').textContent.toLowerCase();
        const noteCategory = note.getAttribute('data-category').toLowerCase();

        if (noteTitle.includes(searchQuery) || noteCategory.includes(searchQuery)) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}

// تحميل الملاحظات عند تحميل الصفحة
window.onload = function() {
    loadNotes();
};
