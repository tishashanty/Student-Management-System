
// 1. Load saved attendance records
window.attendance = JSON.parse(
    localStorage.getItem("attendance")
) || [];


// 2. Save attendance records
function saveAttendance() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(window.attendance)
    );

}


// 3. Display students in attendance table
function displayAttendance() {

    const table = document.getElementById("attendanceTable");

    table.innerHTML = "";

    window.students.forEach(function(student) {

        const today = new Date().toLocaleDateString("en-CA");

        const record = window.attendance.find(function(item) {
            return item.id === student.id && item.date === today;
        });

        const status = record ? record.status : "Not Marked";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>

            <td>
                <button onclick="markAttendance('${student.id}', 'Present')">
                    Present
                </button>

                <button onclick="markAttendance('${student.id}', 'Absent')">
                    Absent
                </button>

                <span>${status}</span>
            </td>
        `;

        table.appendChild(row);

    });

}


// 4. Mark attendance
function markAttendance(id, status) {

    const today = new Date().toLocaleDateString("en-CA");

    const existingRecord = window.attendance.find(function(item) {
        return item.id === id && item.date === today;
    });

    if (existingRecord) {

        existingRecord.status = status;

    } else {

        window.attendance.push({
            id: id,
            date: today,
            status: status
        });

    }

    saveAttendance();

    displayAttendance();

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    alert("Attendance marked as " + status);

}


// 5. Display attendance when website opens
displayAttendance();
