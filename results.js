
/* =================================
   RESULTS.JS
   Student Results Management
================================= */

// 1. Calculate grade
function calculateGrade(percentage) {

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 40) return "D";

    return "F";

}


// 2. Display student results
function displayResults() {

    const resultsTable = document.getElementById("resultsTable");

    if (window.results.length === 0) {

        resultsTable.innerHTML = `
            <tr>
                <td colspan="9" class="empty-message">
                    No results available.
                </td>
            </tr>
        `;

        return;
    }

    resultsTable.innerHTML = window.results.map(function(result) {

        // Get the latest student name
        const student = window.students.find(function(item) {
            return item.id === result.studentId;
        });

        const studentName = student
            ? student.name
            : result.studentName;

        const resultClass = result.status === "Pass"
            ? "status-pass"
            : "status-fail";

        return `
            <tr>
                <td>${escapeHTML(result.studentId)}</td>
                <td>${escapeHTML(studentName)}</td>
                <td>${escapeHTML(result.python)}</td>
                <td>${escapeHTML(result.html)}</td>
                <td>${escapeHTML(result.javascript)}</td>
                <td>${escapeHTML(result.total)}</td>
                <td>${escapeHTML(result.percentage)}%</td>
                <td>${escapeHTML(result.grade)}</td>

                <td>
                    <span class="status ${resultClass}">
                        ${escapeHTML(result.status)}
                    </span>
                </td>
            </tr>
        `;

    }).join("");

}


// 3. Handle result form submission
document.getElementById("resultForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const studentId = document.getElementById("resultStudentId")
        .value.trim().toUpperCase();

    const python = Number(document.getElementById("pythonMarks").value);

    const html = Number(document.getElementById("htmlMarks").value);

    const javascript = Number(
        document.getElementById("javascriptMarks").value
    );


    // 4. Find student
    const student = window.students.find(function(item) {

        return item.id.toUpperCase() === studentId;

    });

    if (!student) {

        alert("Student ID not found. Register the student first.");

        return;
    }


    // 5. Validate marks
    const marks = [python, html, javascript];

    const invalidMarks = marks.some(function(mark) {

        return !Number.isFinite(mark) || mark < 0 || mark > 100;

    });

    if (invalidMarks) {

        alert("Marks must be between 0 and 100.");

        return;
    }


    // 6. Calculate total
    const total = python + html + javascript;


    // 7. Calculate percentage
    const percentage = Number((total / 3).toFixed(2));


    // 8. Calculate grade
    const grade = calculateGrade(percentage);


    // 9. Calculate Pass or Fail
    const status = marks.every(function(mark) {

        return mark >= 40;

    }) ? "Pass" : "Fail";


    // 10. Create result object
    const resultRecord = {

        studentId: student.id,
        studentName: student.name,

        python: python,
        html: html,
        javascript: javascript,

        total: total,
        percentage: percentage,

        grade: grade,
        status: status

    };


    // 11. Check for existing result
    const existingIndex = window.results.findIndex(function(result) {

        return result.studentId === student.id;

    });


    if (existingIndex !== -1) {

        // Update existing result
        window.results[existingIndex] = resultRecord;

    } else {

        // Add new result
        window.results.push(resultRecord);

    }


    // 12. Save results
    saveResults();


    // 13. Refresh results table
    displayResults();


    // 14. Clear form
    this.reset();


    // 15. Show calculated result
    alert(
        "Result calculated successfully!\n\n" +
        "Total: " + total + "/300\n" +
        "Percentage: " + percentage + "%\n" +
        "Grade: " + grade + "\n" +
        "Result: " + status
    );

});


// 16. Display results when website opens
displayResults();
