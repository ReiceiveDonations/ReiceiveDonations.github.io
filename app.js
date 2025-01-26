// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCf6tLw7fZqUQV4ynMRMRdkedNIjkPelII",
    authDomain: "lets-go-gambling.firebaseapp.com",
    projectId: "lets-go-gambling",
    storageBucket: "lets-go-gambling.appspot.com",
    messagingSenderId: "742916336208",
    appId: "1:742916336208:web:406296fe1405e424a07f55",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Utility function to toggle views
const showView = (view) => {
    document.getElementById("auth").style.display = view === "auth" ? "block" : "none";
    document.getElementById("dashboard").style.display = view === "dashboard" ? "block" : "none";
};

// Sign Up
document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), { email, credits: 1000 });
        alert("Sign-up successful!");
        showView("dashboard");
        document.getElementById("userEmail").textContent = email;
    } catch (error) {
        alert("Error signing up: " + error.message);
    }
});

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const userData = userDoc.data();
        alert("Login successful!");
        showView("dashboard");
        document.getElementById("userEmail").textContent = userData.email;
        document.getElementById("userBalance").textContent = userData.credits;
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully!");
        showView("auth");
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
});

// Redeem Code
document.getElementById("redeemCodeBtn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to redeem a code.");
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { credits: increment(500) });
        const updatedDoc = await getDoc(userRef);
        document.getElementById("userBalance").textContent = updatedDoc.data().credits;
        alert("Code redeemed! +500 credits added.");
    } catch (error) {
        alert("Error redeeming code: " + error.message);
    }
});
