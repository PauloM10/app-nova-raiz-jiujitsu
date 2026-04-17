import {
  addDoc,
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

const alunosCollection = collection(db, "alunos");

export async function cadastrarAluno(dadosAluno) {
  const senhaInicial = dadosAluno.senha?.trim() || "123456";

  if (!dadosAluno.email?.trim()) {
    throw new Error("Informe o e-mail do aluno.");
  }

  const credencial = await createUserWithEmailAndPassword(
    secondaryAuth,
    dadosAluno.email.trim(),
    senhaInicial
  );

  const uid = credencial.user.uid;

  try {
    await setDoc(doc(db, "usuarios", uid), {
      uid,
      nome: dadosAluno.nome,
      email: dadosAluno.email.trim(),
      perfil: "aluno",
      criadoEm: serverTimestamp(),
    });

    const payload = {
      uid,
      nome: dadosAluno.nome,
      email: dadosAluno.email.trim(),
      telefone: dadosAluno.telefone || "",
      faixa: dadosAluno.faixa || "",
      turma: dadosAluno.turma || "",
      perfil: "aluno",
      criadoEm: serverTimestamp(),
    };

    const docRef = await addDoc(alunosCollection, payload);

    await signOut(secondaryAuth);

    return docRef;
  } catch (error) {
    await signOut(secondaryAuth);
    throw error;
  }
}

export async function listarAlunos() {
  const q = query(alunosCollection, orderBy("nome"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function atualizarAluno(id, dadosAluno) {
  const alunoRef = doc(db, "alunos", id);

  await updateDoc(alunoRef, {
    nome: dadosAluno.nome,
    email: dadosAluno.email,
    telefone: dadosAluno.telefone,
    faixa: dadosAluno.faixa,
    turma: dadosAluno.turma,
  });
}

export async function excluirAluno(id) {
  const alunoRef = doc(db, "alunos", id);
  await deleteDoc(alunoRef);
}