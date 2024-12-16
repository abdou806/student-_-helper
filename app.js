// إعداد Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // استبدل بمفتاحك
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
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
    storageRef.put(file).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
        // حفظ الملاحظة في localStorage
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.push({
            subject: subject,
            category: category,
            fileName: file.name,
            fileUrl: downloadURL,
            description: description
        });
        localStorage.setItem('notes', JSON.stringify(notes));

        alert('تم رفع الملاحظة بنجاح!');
        loadNotes();
    }).catch(error => {
        console.error('Error uploading file:', error.message);
        alert('حدث خطأ أثناء رفع الملف.');
    });
});

// تحميل الملاحظات وعرضها
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';

        noteDiv.innerHTML = `
            <h3>الموضوع: ${note.subject}</h3>
            <p>التصنيف: ${note.category}</p>
            <p>الوصف: ${note.description || 'لا يوجد وصف.'}</p>
            <a href="${note.fileUrl}" target="_blank">تحميل الملف: ${note.fileName}</a>
            <hr>
        `;

        notesList.appendChild(noteDiv);
    });
}

// تحميل الملاحظات عند فتح الصفحة
window.onload = loadNotes;
