
// 1. Load saved results
window.results = JSON.parse(
    localStorage.getItem("results")
) || [];


// 2. Save results
function saveResults() {

    localStorage.setItem(
        "results",
        JSON.stringify(window.results)
    );

}


// 3. Calculate grade
function calculateGrade(percentage) {

    if (percentage >= 90) {
        return "A+";
    }
    else if (percentage >= 80) {
        return "A";
    }
    else if (percentage >= 70) {
        return "B";
    }
    else if (percentage >= 60) {
        return "C";
    }
    else if (percentage >= 40) {
        return "D";
    }
    else {
        return "F";
    }

}


// 4. Display results
function displayResults() {

    const table = document.getElementById("resultsTable");

    table.innerHTML = "";

    window.results.forEach(function(result) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${result.id}</td>
            <td>${result.name}</td>
            <td>${result.python}</td>
            <td>${result.html}</td>
            <td>${result.javascript}</td>
            <td>${result.total}</td>
            <td>${result.percentage}%</td>
            <td>${result.grade}</td>
            <td>${result.status}</td>
        `;

        table.appendChild(row);

    });

}


// 5. Add and calculate student results
document.getElementById("resultForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const id = document.getElementById("resultStudentId").value.trim();

        const student = window.students.find(function(item) {
            return item.id.toLowerCase() === id.toLowerCase();
        });

        if (!student) {
            alert("Student ID not found!");
            return;
        }

        const python = Number(document.getElementById("pythonMarks").value);
        const html = Number(document.getElementById("htmlMarks").value);
        const javascript = Number(document.getElementById("javascriptMarks").value);

        const total = python + html + javascript;

        const percentage = Number((total / 3).toFixed(2));

        const grade = calculateGrade(percentage);

        const status =
            python >= 40 && html >= 40 && javascript >= 40
                ? "Pass"
                : "Fail";

        const result = {
            id: student.id,
            name: student.name,
            python: python,
            html: html,
            javascript: javascript,
            total: total,
            percentage: percentage,
            grade: grade,
            status: status
        };

        // Update existing result or add a new one
        const existingIndex = window.results.findIndex(function(item) {
            return item.id === student.id;
        });

        if (existingIndex !== -1) {
            window.results[existingIndex] = result;
        } else {
            window.results.push(result);
        }

        saveResults();

        displayResults();

        this.reset();

        alert("Student result calculated successfully!");

});


// 6. Display saved results when website opens
displayResults();
