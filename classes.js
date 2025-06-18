let studentDocs = {};
let currentStudent = null;

function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const enrollment = document.getElementById('enrollmentNo').value.trim();
    const year = document.getElementById('joiningYear').value.trim();
    if (!name || !enrollment || !year) {
        alert('Please fill all fields.');
        return;
    }
    // Check for duplicate enrollment number
    const rows = document.querySelectorAll('#studentTbody tr');
    for (let row of rows) {
        if (row.children[1].textContent === enrollment) {
            alert('Enrollment number already exists.');
            return;
        }
    }
    const tbody = document.getElementById('studentTbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><span class="student-link" onclick="showDocuments('${name.replace(/'/g, "\\'")}', '${enrollment}')">${name}</span></td>
        <td>${enrollment}</td>
        <td>${year}</td>
        <td><button class="remove-btn" onclick="removeStudent(this)">Remove</button></td>
    `;
    tbody.appendChild(tr);
    // Initialize empty docs for new student
    studentDocs[enrollment] = [];
    document.getElementById('studentName').value = '';
    document.getElementById('enrollmentNo').value = '';
    document.getElementById('joiningYear').value = '';
}
function removeStudent(btn) {
    if (confirm('Are you sure you want to remove this student?')) {
        const row = btn.closest('tr');
        const enrollment = row.children[1].textContent;
        delete studentDocs[enrollment];
        row.remove();
    }
}
function showDocuments(name, enrollment) {
    currentStudent = enrollment;
    document.getElementById('modalHeader').textContent = `Documents of ${name} (${enrollment})`;
    renderDocuments();
    document.getElementById('docModal').style.display = 'flex';
    document.getElementById('newDocName').value = '';
    document.getElementById('newDocFile').value = '';
}
function closeModal() {
    document.getElementById('docModal').style.display = 'none';
}
function renderDocuments() {
    const docList = document.getElementById('docList');
    docList.innerHTML = '';
    const docs = studentDocs[currentStudent] || [];
    if (docs.length === 0) {
        docList.innerHTML = '<li style="color:#888;">No documents found.</li>';
    } else {
        docs.forEach((doc, idx) => {
            const fileInfo = doc.file ? ` <span style="color:#888;font-size:0.95em;">(${doc.file})</span>` : '';
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${doc.name}${fileInfo}</span>
                <span class="doc-actions">
                    <button class="download-btn" onclick="downloadDoc('${doc.name.replace(/'/g, "\\'")}', '${doc.file ? doc.file.replace(/'/g, "\\'") : ''}')">Download</button>
                    <button class="remove-doc-btn" onclick="removeDoc(${idx})">Remove</button>
                </span>
            `;
            docList.appendChild(li);
        });
    }
}
function addDocument(e) {
    e.preventDefault();
    const docName = document.getElementById('newDocName').value.trim();
    const docFileInput = document.getElementById('newDocFile');
    const docFile = docFileInput.files[0];
    if (!docName || !docFile) return;
    if (!studentDocs[currentStudent]) studentDocs[currentStudent] = [];
    studentDocs[currentStudent].push({ name: docName, file: docFile.name });
    renderDocuments();
    document.getElementById('newDocName').value = '';
    document.getElementById('newDocFile').value = '';
}
function removeDoc(idx) {
    if (confirm('Remove this document?')) {
        studentDocs[currentStudent].splice(idx, 1);
        renderDocuments();
    }
}
function downloadDoc(docName, fileName) {
    alert('Download: ' + docName + (fileName ? ' (' + fileName + ')' : ''));
    // In real app, trigger download here
}
function logout() {
    window.location.href = "index.html";
}
// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('docModal');
    if (event.target === modal) {
        closeModal();
    }
};