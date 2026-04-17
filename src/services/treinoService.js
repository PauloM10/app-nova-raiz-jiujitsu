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
} from "firebase/firestore";
import { db } from "./firebase";

const treinosCollection = collection(db, "treinos");

export async function cadastrarTreino(dadosTreino) {
  const payload = {
    titulo: dadosTreino.titulo,
    descricao: dadosTreino.descricao,
    data: dadosTreino.data,
    horario: dadosTreino.horario,
    turma: dadosTreino.turma,
    criadoEm: serverTimestamp(),
  };

  const docRef = await addDoc(treinosCollection, payload);
  return docRef;
}

export async function listarTreinos() {
  const q = query(treinosCollection, orderBy("data"));
  const snapshot = await getDocs(q);

  const treinos = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  treinos.sort((a, b) => {
    const dataA = a.data || "";
    const dataB = b.data || "";

    if (dataA !== dataB) {
      return dataA.localeCompare(dataB);
    }

    const horarioA = a.horario || "";
    const horarioB = b.horario || "";

    return horarioA.localeCompare(horarioB);
  });

  return treinos;
}

export async function atualizarTreino(id, dadosTreino) {
  const treinoRef = doc(db, "treinos", id);

  await updateDoc(treinoRef, {
    titulo: dadosTreino.titulo,
    descricao: dadosTreino.descricao,
    data: dadosTreino.data,
    horario: dadosTreino.horario,
    turma: dadosTreino.turma,
  });
}

export async function excluirTreino(id) {
  const treinoRef = doc(db, "treinos", id);
  await deleteDoc(treinoRef);
}