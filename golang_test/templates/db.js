let db;
var v=1;
var jmsg={
  FirstName: String,
  LastName: String,
  Company: String,
  Email: String,
  Username: String
};
let dbReq = indexedDB.open('profile', v);
dbReq.onupgradeneeded = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;

  // Create an object store named profile. Object stores
  // in databases are where data are stored.
  let profile = db.createObjectStore('profile', {autoIncrement: false });
}

dbReq.onsuccess = function(event) {
  db = event.target.result;
this.addEventListener("load",readInfo(db));
this.addEventListener("online",sendInfo(db));
  // readInfo(db);
  // sendInfo(db);
}

dbReq.onerror = function(event) {
  alert('error opening database : ' + event.target.errorCode);
}

function addInfo(db, message, id) {
    // Start a database transaction and get the notes object store
    let tx = db.transaction(['profile'], 'readwrite');
    let store = tx.objectStore('profile');
    // Put the sticky note into the object store
    let info = {text: message, timestamp: Date.now()};
    store.put(info, id);
    // Wait for the database transaction to complete
    tx.oncomplete = function() { console.log('stored user!') }
    tx.onerror = function(event) {
      alert('error storing info ' + event.target.errorCode);
    }
  }

  function submitInfo() {
    v++;
    let firstName = document.getElementById('firstName');
    addInfo(db, firstName.value, 1);
    // firstName.value = '';
    let lastName = document.getElementById('lastName');
    addInfo(db, lastName.value, 2);
    // lastName.value = '';
    let company = document.getElementById('company');
    addInfo(db, company.value, 3);
    // company.value = '';
    let email = document.getElementById('email');
    addInfo(db, email.value, 4);
    // email.value = '';
    let username = document.getElementById('username');
    addInfo(db, username.value, 5);
    // username.value = '';
    let password = document.getElementById('password1');
    addInfo(db, password.value, 6);
    // password.value = '';
  }



// function getAndDisplayInfo(db) {
//     let tx = db.transaction(['profile'], 'readonly');
//     let store = tx.objectStore('profile');
//     // Create a cursor request to get all items in the store, which 
//     // we collect in the allInfo array
//     let req = store.openCursor();
//     let allInfo = [];
  
//     req.onsuccess = function(event) {
//       // The result of req.onsuccess is an IDBCursor
//       let cursor = event.target.result;
//       if (cursor != null) {
//         // If the cursor isn't null, we got an IndexedDB item.
//         // Add it to the info array and have the cursor continue!
//         allInfo.push(cursor.value);
//         cursor.continue();
//       } else {
//         // If we have a null cursor, it means we've gotten
//         // all the items in the store, so display the infos we got
//         displayInfo(allInfo);
//       }
//     }
//     req.onerror = function(event) {
//       alert('error in cursor request ' + event.target.errorCode);
//     }
//   }

//   function displayInfo(infos){
//     let str = ["firstName", "lastName", "company", "email", "username", "password1"];
//     for (let i = 0; i < 6; i++) {
//         let info = infos[i];
//         document.getElementById(str[i]).innerHTML=info;
//       }

//   }




function readInfo(db) {
// Set up an object store and transaction
let tx = db.transaction(['profile'], 'readonly');
let store = tx.objectStore('profile');
// Set up a request to get the sticky note with the key 1
let req = store.get(1);
// We can use the note if the request succeeds, getting it in the
// onsuccess handler
req.onsuccess = function(event) {
  let info = event.target.result;
  if (info) {
    document.getElementById('firstName').value=info.text;
    console.log(info);
  } else {
    document.getElementById('firstName').value="";
    console.log("info 1 not found")
  }
}
// If we get an error, like that the info wasn't in the object
// store, we handle the error in the onerror handler
req.onerror = function(event) {
  alert('error getting ibfo 1 ' + event.target.errorCode);
}


req = store.get(2);
// We can use the note if the request succeeds, getting it in the
// onsuccess handler
req.onsuccess = function(event) {
  let info = event.target.result;
  if (info) {
    document.getElementById('lastName').value=info.text;
    console.log(info);
  } else {
    document.getElementById('lastName').value="";
    console.log("info 1 not found")
  }
}
// If we get an error, like that the info wasn't in the object
// store, we handle the error in the onerror handler
req.onerror = function(event) {
  alert('error getting ibfo 1 ' + event.target.errorCode);
}


req = store.get(3);
// We can use the note if the request succeeds, getting it in the
// onsuccess handler
req.onsuccess = function(event) {
  let info = event.target.result;
  if (info) {
    document.getElementById('company').value=info.text;
    console.log(info);
  } else {
    document.getElementById('company').value="";
    console.log("info 1 not found")
  }
}
// If we get an error, like that the info wasn't in the object
// store, we handle the error in the onerror handler
req.onerror = function(event) {
  alert('error getting ibfo 1 ' + event.target.errorCode);
}


req = store.get(4);
// We can use the note if the request succeeds, getting it in the
// onsuccess handler
req.onsuccess = function(event) {
  let info = event.target.result;
  if (info) {
    document.getElementById('email').value=info.text;
    console.log(info);
  } else {
    document.getElementById('email').value="";
    console.log("info 1 not found")
  }
}
// If we get an error, like that the info wasn't in the object
// store, we handle the error in the onerror handler
req.onerror = function(event) {
  alert('error getting ibfo 1 ' + event.target.errorCode);
}


req = store.get(5);
// We can use the note if the request succeeds, getting it in the
// onsuccess handler
req.onsuccess = function(event) {
  let info = event.target.result;
  if (info) {
    document.getElementById('username').value=info.text;
    console.log(info);
  } else {
    document.getElementById('username').value="";
    console.log("info 1 not found")
  }
}
// If we get an error, like that the info wasn't in the object
// store, we handle the error in the onerror handler
req.onerror = function(event) {
  alert('error getting ibfo 1 ' + event.target.errorCode);
}

}



// function sendInfo(db){

// // Set up an object store and transaction
// let tx = db.transaction(['profile'], 'readonly');
// let store = tx.objectStore('profile');
// // Set up a request to get the sticky note with the key 1

// let req = store.get(1);
// req.onsuccess = function(event) {
//   let info = event.target.result;
//   if (info) {
//     jmsg.FirstName=info.text;
//     console.log(info);}
// }
// req.onerror = function(event) {
//   alert('error getting ibfo 1 ' + event.target.errorCode);
// }

// req = store.get(2);
// req.onsuccess = function(event) {
//   let info = event.target.result;
//   if (info) {
//     jmsg.LastName=info.text;
//     console.log(info);}
// }
// req.onerror = function(event) {
//   alert('error getting ibfo 1 ' + event.target.errorCode);
// }

// req = store.get(3);
// req.onsuccess = function(event) {
//   let info = event.target.result;
//   if (info) {
//     jmsg.Company=info.text;
//     console.log(info);}
// }
// req.onerror = function(event) {
//   alert('error getting ibfo 1 ' + event.target.errorCode);
// }

// req = store.get(4);
// req.onsuccess = function(event) {
//   let info = event.target.result;
//   if (info) {
//     jmsg.Email=info.text;
//     console.log(info);}
// }
// req.onerror = function(event) {
//   alert('error getting ibfo 1 ' + event.target.errorCode);
// }

// req = store.get(5);
// req.onsuccess = function(event) {
//   let info = event.target.result;
//   if (info) {
//     jmsg.Username=info.text;
//     console.log(info);}
// }
// req.onerror = function(event) {
//   alert('error getting ibfo 1 ' + event.target.errorCode);
// }

// console.log(jmsg);
// console.log(JSON.stringify(jmsg));

//   var xhr = new XMLHttpRequest();
//   xhr.open("POST", "ajax", true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(JSON.stringify(jmsg));
// }


function sendInfo(db) {
    let tx = db.transaction(['profile'], 'readonly');
    let store = tx.objectStore('profile');
    // Create a cursor request to get all items in the store, which 
    // we collect in the allInfo array
    let req = store.openCursor();
    let allInfo = [];
  
    req.onsuccess = function(event) {
      // The result of req.onsuccess is an IDBCursor
      let cursor = event.target.result;
      if (cursor != null) {
        // If the cursor isn't null, we got an IndexedDB item.
        // Add it to the info array and have the cursor continue!
        allInfo.push(cursor.value);
        cursor.continue();
      } else {
        // If we have a null cursor, it means we've gotten
        // all the items in the store, so display the infos we got
        jmsg.FirstName=allInfo[0].text;
        jmsg.LastName=allInfo[1].text;
        jmsg.Company=allInfo[2].text;
        jmsg.Email=allInfo[3].text;
        jmsg.Username=allInfo[4].text;
        console.log(JSON.stringify(jmsg));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "ajax", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(jmsg));
      }
    }
    req.onerror = function(event) {
      alert('error in cursor request ' + event.target.errorCode);
    }
  }