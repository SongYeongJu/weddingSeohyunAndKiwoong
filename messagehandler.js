// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyB5MuG1d2E3ZWaoT1XhyD0oHBzmq96pAaE",
    authDomain: "wedding-shkw.firebaseapp.com",
    projectId: "wedding-shkw",
    storageBucket: "wedding-shkw.firebasestorage.app",
    messagingSenderId: "650473363557",
    appId: "1:650473363557:web:7f2139eed08ec996690e8c",
    measurementId: "G-36CMWY4M4N"
  };

// Firebase 초기화

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
});

function loadMessages() {
    if (db == null) {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();  
    }

    db.collection("messages").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const message = doc.data();
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <strong>${message.name}</strong>
                    <span class="message-time">${new Date(message.timestamp.toDate()).toLocaleString()}</span>
                    <p>${message.content}</p>
                </div>
                <span class="delete-btn" onclick="confirmDeleteMessage('${doc.id}')">&times;</span>
            `;
            messageList.appendChild(messageDiv);
        });
    });
}

function addMessage() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const content = document.getElementById('content').value;

    if (name && password && content) {
        if (db == null) {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();  
        }
        db.collection("messages").add({
            name,
            password,
            content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById('name').value = '';
            document.getElementById('password').value = '';
            document.getElementById('content').value = '';
        }).catch((error) => {
            console.error("Error adding message: ", error);
        });
    } else {
        alert('모든 필드를 입력해 주세요.');
    }
}

function confirmDeleteMessage(id) {
    const password = prompt('비밀번호를 입력해 주세요:');
    if (password !== null) {
        if (db == null) {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();  
        }
        db.collection("messages").doc(id).get().then((doc) => {
            if (doc.exists && doc.data().password === password) {
                db.collection("messages").doc(id).delete().then(() => {
                    console.log("Message successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing message: ", error);
                });
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        }).catch((error) => {
            console.error("Error getting message: ", error);
        });
    }
}