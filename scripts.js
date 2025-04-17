document.getElementById('application').addEventListener('change', function() {
    const selectedApp = this.value;
    if (selectedApp && applications[selectedApp]) {
        document.getElementById('prefix').value = applications[selectedApp].prefix;
        document.getElementById('naming').value = applications[selectedApp].naming.replace(/_/g, ' ');
    }
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function loadResults() {
    const resultTableBody = document.getElementById('resultTable').querySelector('tbody');
    const results = getCookie('results');
    if (results) {
        const parsedResults = JSON.parse(results);
        parsedResults.forEach(result => {
            const row = document.createElement('tr');
            const iniCell = document.createElement('td');
            const finalNumberCell = document.createElement('td');
            const namingCell = document.createElement('td');
            iniCell.textContent = result.ini;
            finalNumberCell.textContent = result.finalNumber;
            namingCell.innerHTML = `<input type="text" value="${result.naming}">`;
            row.appendChild(iniCell);
            row.appendChild(finalNumberCell);
            row.appendChild(namingCell);
            resultTableBody.appendChild(row);
        });
    }
}

function saveResults() {
    const resultTableBody = document.getElementById('resultTable').querySelector('tbody');
    const results = [];
    resultTableBody.querySelectorAll('tr').forEach(row => {
        const ini = row.cells[0].textContent;
        const finalNumber = row.cells[1].textContent;
        const naming = row.cells[2].querySelector('input').value;
        results.push({ ini, finalNumber, naming });
    });
    setCookie('results', JSON.stringify(results), 7);
}

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const ini = document.getElementById('ini').value;
    const prefix = document.getElementById('prefix').value;
    const startNumber = parseInt(document.getElementById('startNumber').value);
    const totalResults = parseInt(document.getElementById('totalResults').value);
    const naming = document.getElementById('naming').value;
    const resultTableBody = document.getElementById('resultTable').querySelector('tbody');

    for (let i = 0; i < totalResults; i++) {
        const finalNumber = prefix + String(startNumber + i).padStart(10 - prefix.length, '0');
        const row = document.createElement('tr');
        const iniCell = document.createElement('td');
        const finalNumberCell = document.createElement('td');
        const namingCell = document.createElement('td');
        iniCell.textContent = ini;
        finalNumberCell.textContent = finalNumber;
        namingCell.innerHTML = `<input type="text" value="${naming}">`;
        row.appendChild(iniCell);
        row.appendChild(finalNumberCell);
        row.appendChild(namingCell);
        resultTableBody.appendChild(row);
    }
    saveResults(); // Save the results after updating the table
});

document.getElementById('exportButton').addEventListener('click', function() {
    const resultTableBody = document.getElementById('resultTable').querySelector('tbody');
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<results>\n';

    resultTableBody.querySelectorAll('tr').forEach(row => {
        const ini = row.cells[0].textContent;
        const finalNumber = row.cells[1].textContent;
        const naming = row.cells[2].querySelector('input').value;
        xml += `  <result>\n    <ini>${ini}</ini>\n    <finalNumber>${finalNumber}</finalNumber>\n    <naming>${naming}</naming>\n  </result>\n`;
    });

    xml += '</results>';

    const blob = new Blob([xml], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'results.xml';
    link.click();
});

document.getElementById('emptyButton').addEventListener('click', function() {
    const resultTableBody = document.getElementById('resultTable').querySelector('tbody');
    resultTableBody.innerHTML = '';
    setCookie('results', '', -1); // Clear the cookie
});

document.getElementById('saveButton').addEventListener('click', function() {
    saveResults();
    alert('Tabel opgeslagen');
});

document.getElementById('openZenyaButton').addEventListener('click', function() {
    window.open('https://infoland.olvg.nl/portal/#/document/93259420-abbc-47db-ac90-cfdcbd390c38', '_blank');
});

window.onload = loadResults;