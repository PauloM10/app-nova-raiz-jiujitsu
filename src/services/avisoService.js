import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const avisosCollection = collection(db, "avisos");

export async function cadastrarAviso(dadosAviso) {
  const payload = {
    titulo: dadosAviso.titulo,
    texto: dadosAviso.texto,
    destaque: !!dadosAviso.destaque,
    criadoEm: serverTimestamp(),
  };

  if (payload.destaque) {
    await removerDestaqueDosOutrosAvisos();
  }

  const docRef = await addDoc(avisosCollection, payload);
  return docRef;
}

export async function listarAvisos() {
  const q = query(avisosCollection, orderBy("titulo"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function atualizarAviso(id, dadosAviso) {
  if (dadosAviso.destaque) {
    await removerDestaqueDosOutrosAvisos(id);
  }

  await updateDoc(doc(db, "avisos", id), {
    titulo: dadosAviso.titulo,
    texto: dadosAviso.texto,
    destaque: !!dadosAviso.destaque,
  });
}

export async function excluirAviso(id) {
  await deleteDoc(doc(db, "avisos", id));
}

export async function buscarAvisoDestaque() {
  const q = query(avisosCollection, where("destaque", "==", true));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const item = snapshot.docs[0];
  return {
    id: item.id,
    ...item.data(),
  };
}

async function removerDestaqueDosOutrosAvisos(idAtual = null) {
  const q = query(avisosCollection, where("destaque", "==", true));
  const snapshot = await getDocs(q);

  const promessas = snapshot.docs
    .filter((item) => item.id !== idAtual)
    .map((item) =>
      updateDoc(doc(db, "avisos", item.id), {
        destaque: false,
      })
    );

  await Promise.all(promessas);
}