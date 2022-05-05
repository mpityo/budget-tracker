/********
IndexedDB config file
********/

let db;
const request = indexedDB.open('budget', 1);

// run on first run through and whenever version number changes
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('transaction', { autoIncrement: true });
}

// run after the connection to db is finalized
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        uploadInformation();
    }
}

// on error
request.onerror = function (event) {
    console.log(event.target.errorCode);
}

function saveRecord (record) {
    const transaction = db.transaction(['transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('transaction');
    transactionObjectStore.add(record);
}

function uploadInformation () {
    const transaction = db.transaction(['transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('transaction');
    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
        // if there was data in indexedDb's store, let's send it to the api server
            fetch(`/api/transaction/${getAll.result.length > 1 ? 'bulk' : ''}`, {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
             .then(response => response.json())
             .then(ServerResponse => {
                 if (ServerResponse.message) {
                    throw new Error (ServerResponse);
                 }
                 // open one more transaction
                 const transaction = db.transaction(['transaction'], 'readwrite');
                 // access the new_pizza object store
                 const transactionObjectStore = transaction.objectStore('transaction');
                 // clear all items in your store
                 transactionObjectStore.clear();

                 alert('All saved transactions have been submitted');
             })
             .catch(err => {
                 console.log(err);
             });
        }
    }
}

window.addEventListener('online', uploadInformation);