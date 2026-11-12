
/* =================================
   ATTENDANCE.JS
   Attendance Management
================================= */

// 1. Get today's date in YYYY-MM-DD format
function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// 2. Display attendance
function displayAttendance() {

    const attendanceTable = document.getElementById("attendanceTable");

    const today = getTodayDate();

    document.getElementById("attendanceDate").textContent =
        "Date: " + new Date().toLocaleDateString();

    if (window.students.length === 0) {

        attendanceTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    Add students to start attendance.
                </td>
            </tr>
        `;

        return;
    }

    attendanceTable.innerHTML = window.students.map(function(student) {

        // Find today's attendance for this student
        const record = window.attendance.find(function(item) {
            return item.studentId === student.id && item.date === today;
        });

        const status = record ? record.status : "Not Marked";

        let statusClass = "status-pending";

        if (status === "Present") {
            statusClass = "status-present";
        }

        if (status === "Absent") {
            statusClass = "status-absent";
        }

        return `
            <tr>
                <td>${escapeHTML(student.id)}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.course)}</td>

                <td>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </td>

                <td>
                    <button class="present-btn"
                        data-attendance="Present"
                        data-id="${escapeHTML(student.id)}">
                        Present
                    </button>

                    <button class="absent-btn"
                        data-attendance="Absent"
                        data-id="${escapeHTML(student.id)}">
                        Absent
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}


// 3. Handle attendance button clicks
document.getElementById("attendanceTable").addEventListener("click", function(event) {

    const button = event.target.closest("button[data-attendance]");

    if (!button) return;

    const id = button.dataset.id;
    const status = button.dataset.attendance;

    markAttendance(id, status);

});


// 4. Mark attendance
function markAttendance(id, status) {

    const student = window.students.find(function(item) {
        return item.id === id;
    });

    if (!student) {
        alert("Student not found.");
        return;
    }

    if (status !== "Present" && status !== "Absent") {
        alert("Invalid attendance status.");
        return;
    }

    const today = getTodayDate();

    // Check whether attendance is already marked
    const existingRecord = window.attendance.find(function(record) {

        return record.studentId === id && record.date === today;

    });

    if (existingRecord) {

        // Update existing record
        existingRecord.status = status;
        existingRecord.studentName = student.name;

    } else {

        // Create new record
        window.attendance.push({

            studentId: id,
            studentName: student.name,
            date: today,
            status: status

        });

    }

    // Save attendance
    saveAttendance();

    // Refresh attendance and dashboard
    displayAttendance();
    updateDashboard();

}


// 5. Display attendance when website opens
displayAttendance();
