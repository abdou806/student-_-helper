// إعداد Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

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

    // رفع الملف إلى Firebase Storage
    const storageRef = storage.ref('notes/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function(snapshot) {
        // يمكن هنا إضافة تقدم التحميل
    }, function(error) {
        alert('حدث خطأ أثناء رفع الملف: ' + error.message);
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            // حفظ رابط التحميل في localStorage
            const notes = JSON.parse(localStorage.getItem('notes') || '[]');
            notes.push({
                subject: subject,
                category: category,
                fileName: file.name,
                fileUrl: downloadURL,  // حفظ الرابط الفعلي للملف
                description: description,
                comments: []  // إضافة تعليقات فارغة للملاحظة
            });

            localStorage.setItem('notes', JSON.stringify(notes));
            alert('تم رفع الملاحظة بنجاح!');
            loadNotes();
        });
    });
});

// تحميل الملاحظات
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    displayNotes(notes);
}

// عرض الملاحظات
function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach((note, index) => {
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
        downloadLink.href = note.fileUrl;  // الرابط من Firebase
        downloadLink.download = note.fileName;
        downloadLink.textContent = 'تحميل الملف';
        noteDiv.appendChild(downloadLink);

        // إضافة قسم التعليقات
        const commentsSection = document.createElement('div');
        commentsSection.classList.add('comments-section');

        note.comments.forEach(comment => {
            const commentDiv = document.createElement('p');
            commentDiv.textContent = comment;
            commentsSection.appendChild(commentDiv);
        });

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'أضف تعليقًا...';
        const addCommentBtn = document.createElement('button');
        addCommentBtn.textContent = 'إضافة تعليق';
        addCommentBtn.onclick = function() {
            addComment(index, commentInput.value);
            commentInput.value = '';
        };

        commentsSection.appendChild(commentInput);
        commentsSection.appendChild(addCommentBtn);
        noteDiv.appendChild(commentsSection);

        // زر الحذف
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف الملاحظة';
        deleteBtn.onclick = function() {
            deleteNote(index);
        };
        noteDiv.appendChild(deleteBtn);

        notesList.appendChild(noteDiv);
    });
}

// إضافة تعليق للملاحظة
function addComment(noteIndex, commentText) {
    if (commentText.trim() === '') return;

    const notes = JSON.parse(localStorage.getItem('notes'));
    notes[noteIndex].comments.push(commentText);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

// حذف الملاحظة
function deleteNote(noteIndex) {
    const notes = JSON.parse(localStorage.getItem('notes'));
    notes.splice(noteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
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

// تحميل
