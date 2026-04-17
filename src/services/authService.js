import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "./firebase";

export async function login(email, senha) {
  return await signInWithEmailAndPassword(auth, email, senha);
}

export async function cadastrar(email, senha) {
  return await createUserWithEmailAndPassword(auth, email, senha);
}

export async function logout() {
  return await signOut(auth);
}

export function observarAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function recuperarSenha(email) {
  return await sendPasswordResetEmail(auth, email);
}

export async function alterarSenha(novaSenha) {
  if (!auth.currentUser) {
    throw new Error("Nenhum usuário autenticado.");
  }

  return await updatePassword(auth.currentUser, novaSenha);
}