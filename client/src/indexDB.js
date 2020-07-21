const DB_NAME = 'Stock-Trading-Platform';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
export const DB_STORE_NAME = 'stocks';
var db

//開啟資料庫
export async function openDb() {
  console.log("openDb ...");
  let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
  var req = await indexedDB.open(DB_NAME, DB_VERSION);

  req.onsuccess = function (evt) {
    // Better use "this" than "req" to get the result to avoid problems with
    // garbage collection.
    // db = req.result;
    db = this.result;
    console.log("openDb DONE");
  };

  req.onerror = function (evt) {
    console.error("openDb:", evt.target.errorCode);
  };

  // This event is only implemented in recent browsers
  req.onupgradeneeded = function (evt) {
    console.log("openDb.onupgradeneeded");
      // Create an objectStore for this database
    var store = evt.currentTarget.result.createObjectStore(
      DB_STORE_NAME, { keyPath: 'id', autoIncrement: true }
    );

    store.createIndex('biblioid', 'biblioid');
    store.createIndex('title', 'title', { unique: false });
    store.createIndex('year', 'year', { unique: false });
  };
}

/**
 * @param {string} store_name
 * @param {string} mode either "readonly" or "readwrite"
 */
export function getObjectStore(store_name, mode) {
  var tx = db.transaction(store_name, mode);
  return tx.objectStore(store_name);
}

export async function clearObjectStore(store_name) {
  var store = getObjectStore(DB_STORE_NAME, 'readwrite');
  var req = await store.clear();
  req.onsuccess = function(evt) {
    console.log("Store cleared");
  };
  req.onerror = function (evt) {
    console.error("clearObjectStore:", evt.target.errorCode);
  };
}

// openDb()

