// Array of students
let students;

// Function to generate student cards
let generateStudentCards = async () => {
    let xyz = await fetch('http://localhost:8000/getstudents')
    let res = await xyz.json();
    students = res.status ? (students = res.message) : (students = []);

    if (students.length !== 0) {
        const studentListContainer = document.getElementById('student-list');
        studentListContainer.innerHTML = '';

        students.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.setAttribute('class', 'student-card');

            const studentInfoContainer = document.createElement('div');
            studentInfoContainer.setAttribute('class', 'student-info-container');

            const studentPfp = document.createElement('div');
            studentPfp.setAttribute('class', 'student-pfp');
            studentInfoContainer.appendChild(studentPfp);

            const studentInfo = document.createElement('div');
            studentInfo.setAttribute('class', 'student-info');

            const studentName = document.createElement('p');
            studentName.setAttribute('class', 'student-name');
            studentName.textContent = student.name;

            const studentQualification = document.createElement('p');
            studentQualification.setAttribute('class', 'student-qualification');
            studentQualification.textContent = student.qualification;

            studentInfo.appendChild(studentName);
            studentInfo.appendChild(studentQualification);

            studentInfoContainer.appendChild(studentInfo);

            studentCard.appendChild(studentInfoContainer);

            const iconContainer = document.createElement('div');
            iconContainer.setAttribute('class', 'student-icons');

            // Edit Icon
            const editIcon = document.createElement('i');
            editIcon.setAttribute('class', 'fa-solid fa-user-pen edit-icon');
            editIcon.onclick = () => {
                document.getElementById('UpdateID').value = Number(student.id);
                document.getElementById('updateName').value = student.name;
                document.getElementById('updateDepartment').value = student.qualification;
                openUpdate();
            }
            iconContainer.appendChild(editIcon);

            // Delete Icon
            const deleteIcon = document.createElement('i');
            deleteIcon.setAttribute('class', 'fa-solid fa-user-xmark delete-icon');
            deleteIcon.onclick = () => {
                deleteStudent(student.id);
                generateStudentCards();
            }
            iconContainer.appendChild(deleteIcon);

            // Append the icon container to the card
            studentCard.appendChild(iconContainer);

            studentListContainer.appendChild(studentCard);
        });
    }
    else {
        const studentListContainer = document.getElementById('student-list');
        studentListContainer.innerHTML = '';
        studentListContainer.innerText = 'No student found. Add New Student and begin'
        studentListContainer.style.textAlign = 'center';
        studentListContainer.style.marginTop = '5vh'
    }
}
generateStudentCards();



// ADD FORM 
let addfrmstatus = false;
let openAdd = () => {
    if (addfrmstatus) {
        document.getElementById('add-screen').style.display = 'flex';
        addfrmstatus = false;
    }
    else {
        document.getElementById('add-screen').style.display = 'none';
        addfrmstatus = true;
    }
}

//UPDATE FORM 
let updfrmstatus = false;
let openUpdate = () => {
    if (updfrmstatus) {
        document.getElementById('update-screen').style.display = 'flex';
        updfrmstatus = false;
    }
    else {
        document.getElementById('update-screen').style.display = 'none';
        updfrmstatus = true;
    }
}

// ADD NEW STUDENT 
let addnewStudent = async () => {
    let name = document.getElementById('name').value;
    let qualification = document.getElementById('department').value;

    let newStudent = {
        name: name,
        qualification: qualification
    }

    if (!name || !qualification) {
        alert('All fields required...!')
        return
    }

    let res = await fetch('http://localhost:8000/createstudent', {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(newStudent)
    });

    let response = await res.json();
    // console.log(response);

    if (response.status) {
        generateStudentCards()
        document.getElementById('name').value = "";
        document.getElementById('department').value = "";
        openAdd();
    }
}

// DELETE STUDENT 
let deleteStudent = async (dltid) => {
    let dltStatus = confirm("Are you sure?");

    if (dltStatus) {
        let res = await fetch(`http://localhost:8000/deletestudent?id=${dltid}`, {
            method: "DELETE"
        })
        let response = await res.json();

        if (response.status) {
            generateStudentCards();
        }
    }
}

// UPDATE STUDENT
let updateStudent = async () => {
    let updId = Number(document.getElementById('UpdateID').value);
    let updateData = {
        id: updId,
        name: document.getElementById('updateName').value,
        qualification: document.getElementById('updateDepartment').value
    }
    let res = await fetch(`http://localhost:8000/editstudent?id=${updId}`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(updateData)
    })
    let response = await res.json();

    if (response.status) {
        openUpdate();
        generateStudentCards();
    }
}