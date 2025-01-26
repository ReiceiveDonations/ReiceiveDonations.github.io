// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCf6tLw7fZqUQV4ynMRMRdkedNIjkPelII",
    authDomain: "lets-go-gambling.firebaseapp.com",
    projectId: "lets-go-gambling",
    storageBucket: "lets-go-gambling.appspot.com",
    messagingSenderId: "742916336208",
    appId: "1:742916336208:web:406296fe1405e424a07f55"
};

// Initialize Firebase
// Ensure the script is being treated as a module
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// DOM Elements
const loginDiv = document.getElementById("login");
const signupDiv = document.getElementById("signup");
const dashboardDiv = document.getElementById("dashboard");
const userEmailSpan = document.getElementById("userEmail");
const userBalanceSpan = document.getElementById("userBalance");

document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), { balance: 1000 });
        alert("Sign up successful! You received 1000 fake credits.");
        showDashboard(user);
    } catch (error) {
        alert("Error signing up: " + error.message);
    }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        showDashboard(user);
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    showAuth();
});

document.getElementById("redeemCodeBtn").addEventListener("click", async () => {
    const code = prompt("Enter a promo code:");
    if (code === "FREECREDIT") {
        const user = auth.currentUser;
        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, { balance: increment(500) });
        alert("500 credits added to your balance!");
        loadUserBalance(user);
    } else {
        alert("Invalid promo code.");
    }
});

async function showDashboard(user) {
    loginDiv.style.display = "none";
    signupDiv.style.display = "none";
    dashboardDiv.style.display = "block";
    userEmailSpan.textContent = user.email;
    loadUserBalance(user);
}

async function showAuth() {
    loginDiv.style.display = "block";
    signupDiv.style.display = "block";
    dashboardDiv.style.display = "none";
}

async function loadUserBalance(user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
        userBalanceSpan.textContent = userDoc.data().balance;
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        showDashboard(user);
    } else {
        showAuth();
    }
});

