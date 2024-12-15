// التعامل مع رفع الملاحظات
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // الحصول على المدخلات من النموذج
    const subject = document.getElementById('subject').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('file').files[0];
    const description = document.getElementById('description').value;

    // التحقق من أن الملف موجود
    if (!file) {
        alert('يرجى اختيار ملف لتحميله.');
        return;
    }

    // إنشاء العنصر الجديد لعرض الملاحظة
    const note = document.createElement('div');
    note.classList.add('note');
    note.setAttribute('data-category', category.toLowerCase());

    const noteTitle = document.createElement('h3');
    noteTitle.textContent = subject;
    note.appendChild(noteTitle);
    
    const noteCategory = document.createElement('p');
    noteCategory.textContent = `التصنيف: ${category}`;
    note.appendChild(noteCategory);

    const noteDescription = document.createElement('p');
    noteDescription.textContent = description || 'لا يوجد وصف للملاحظة.';
    note.appendChild(noteDescription);
    
    // عرض رابط لتحميل الملف
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = file.name;
    downloadLink.textContent = 'تحميل الملف';
    note.appendChild(downloadLink);

    // إضافة الزر للتقييم
    const rateButton = document.createElement('button');
    rateButton.textContent = 'قيم هذه الملاحظة';
    rateButton.addEventListener('click', function() {
        let rating = prompt('أدخل تقييمك (من 1 إلى 5):');
        if (rating >= 1 && rating <= 5) {
            alert(`تم تقييم الملاحظة بـ ${rating} نجوم!`);
        } else {
            alert('يرجى إدخال تقييم صحيح من 1 إلى 5.');
        }
    });
    note.appendChild(rateButton);
    
    // إضافة الملاحظة للقائمة
    document.getElementById('notesList').appendChild(note);
    
    // إعادة تعيين النموذج بعد رفع الملاحظة
    document.getElementById('uploadForm').reset();
});

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
