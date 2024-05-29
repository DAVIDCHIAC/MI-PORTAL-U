import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYK6rz6kQqOrIvSqC3DXn5GzwB5zZPFyE",
  authDomain: "control-8ecad.firebaseapp.com",
  databaseURL: "https://control-8ecad-default-rtdb.firebaseio.com",
  projectId: "control-8ecad",
  storageBucket: "control-8ecad.appspot.com",
  messagingSenderId: "430851155996",
  appId: "1:430851155996:web:fddfec795af245ac5417d9",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Iniciar sesión
async function signIn() {
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Usuario inició sesión con éxito:", user.uid);
    localStorage.setItem("userId", user.uid); // Guarda el ID del usuario en localStorage
    window.location.href = "./html/inicio.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
}

// Crear usuario
async function signUp() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("emailSignUp").value;
  const password = document.getElementById("passwordSignUp").value;
  const userId = document.getElementById("userId").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Usuario creado con éxito:", user.uid);
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      userId: userId,
    });
    console.log("ID y nombre guardados en Firestore");
    localStorage.setItem("userId", user.uid); // Guarda el ID del usuario en localStorage
    window.location.href = "./html/inicio.html";
  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
}

// Restablecer contraseña
async function resetPassword() {
  const email = document.getElementById("resetEmail").value;
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Correo de restablecimiento de contraseña enviado");
  } catch (error) {
    alert("Error al enviar correo de restablecimiento de contraseña:", error);
  }
}

// Cerrar sesión
async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("userId"); // Elimina el ID del usuario de localStorage
    window.location.href = "../index.html"; // Redirige al usuario al índice
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

// Mostrar formulario de registro
function showSignUp() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("resetPasswordForm").style.display = "none";
}

// Mostrar formulario de inicio de sesión
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("resetPasswordForm").style.display = "none";
}

// Mostrar formulario de restablecimiento de contraseña
function showResetPassword() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("resetPasswordForm").style.display = "block";
}

// Consultar el nombre del usuario
async function getUserName(userId) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().name;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error al obtener el documento:", error);
  }
}

// Cambiar el nombre en el HTML
async function changeNameInHTML() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    const name = await getUserName(userId);
    const nameElement = document.querySelector(".user-info p");
    if (nameElement && name) {
      nameElement.textContent = name;
    }
  }
}

// Llama a la función para cambiar el nombre en el HTML cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  changeNameInHTML();
  // Añade el evento de logout al botón
  document.getElementById("logoutButton").addEventListener("click", logout);
});

// Agrega las funciones al objeto window
window.signIn = signIn;
window.signUp = signUp;
window.resetPassword = resetPassword;
window.showSignUp = showSignUp;
window.showLogin = showLogin;
window.showResetPassword = showResetPassword;
