// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCf6tLw7fZqUQV4ynMRMRdkedNIjkPelII",
  authDomain: "lets-go-gambling.firebaseapp.com",
  projectId: "lets-go-gambling",
  storageBucket: "lets-go-gambling.appspot.com",
  messagingSenderId: "742916336208",
  appId: "1:742916336208:web:406296fe1405e424a07f55",
  measurementId: "G-SL3WX5TN6D"  // Can be removed if not using analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up Function
document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!email || !password) {
        alert("Please enter valid email and password");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            credits: 1000  // Give users some starting fake credits
        });
        alert("Sign-up successful! Welcome " + email);
    } catch (error) {
        alert("Error signing up: " + error.message);
    }
});

// Login Function
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        alert("Welcome back, " + userDoc.data().email + "! You have " + userDoc.data().credits + " credits.");
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
});

// Logout Function
document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("You have been logged out.");
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
});

// Redeem Code Function (Example Code)
document.getElementById("redeemBtn").addEventListener("click", async () => {
    const code = document.getElementById("redeemCode").value.trim();
    const user = auth.currentUser;

    if (!user) {
        alert("You need to be logged in to redeem a code.");
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            credits: increment(500)  // Add 500 credits for example
        });
        alert("Redeem successful! +500 credits added.");
    } catch (error) {
        alert("Error redeeming code: " + error.message);
    }
});
