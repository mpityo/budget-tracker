/********
IndexedDB config file
********/

let db;
const request = indexedDB.open('budget', 1);

// run on first run through and whenever version number changes
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('deposit', { autoIncrement: true });
    db.createObjectStore('expense', { autoIncrement: true });
}

// run after the connection to db is finalized
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        // uploadDeposit();
        // uploadExpense();
    }
}

// on error
request.onerror = function (event) {
    console.log(event.target.errorCode);
}