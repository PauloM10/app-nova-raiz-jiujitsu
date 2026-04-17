import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db, secondaryAuth } from "./firebase";

const professoresCollection = collection(db, "professores");

export async function cadastrarProfessor(dadosProfessor) {
  const senhaInicial = dadosProfessor.senha?.trim() || "123456";

  if (!dadosProfessor.email?.trim()) {
    throw new Error("Informe o e-mail do professor.");
  }

  const credencial = await createUserWithEmailAndPassword(
    secondaryAuth,
    dadosProfessor.email.trim(),
    senhaInicial
  );

  const uid = credencial.user.uid;

  try {
    await setDoc(doc(db, "usuarios", uid), {
      uid,
      nome: dadosProfessor.nome,
      email: dadosProfessor.email.trim(),
      perfil: "professor",
      criadoEm: serverTimestamp(),
    });

    await setDoc(doc(db, "professores", uid), {
      uid,
      nome: dadosProfessor.nome,
      email: dadosProfessor.email.trim(),
      telefone: dadosProfessor.telefone || "",
      criadoEm: serverTimestamp(),
    });

    await signOut(secondaryAuth);

    return uid;
  } catch (error) {
    await signOut(secondaryAuth);
    throw error;
  }
}

export async function listarProfessores() {
  const q = query(professoresCollection, orderBy("nome"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function atualizarProfessor(id, dadosProfessor) {
  await updateDoc(doc(db, "professores", id), {
    nome: dadosProfessor.nome,
    email: dadosProfessor.email,
    telefone: dadosProfessor.telefone,
  });

  await updateDoc(doc(db, "usuarios", id), {
    nome: dadosProfessor.nome,
    email: dadosProfessor.email,
  });
}

export async function excluirProfessor(id) {
  await deleteDoc(doc(db, "professores", id));
  await deleteDoc(doc(db, "usuarios", id));
}