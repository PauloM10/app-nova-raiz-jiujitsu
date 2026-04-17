import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const chamadasCollection = collection(db, "chamadas");

function getDataHoje() {
  return new Date().toISOString().split("T")[0];
}

export function formatarDataBR(dataIso) {
  if (!dataIso) return "";

  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export async function salvarChamada({
  alunoId,
  alunoNome,
  alunoEmail,
  status,
  observacao,
}) {
  const dataHoje = getDataHoje();

  const q = query(
    chamadasCollection,
    where("alunoId", "==", alunoId),
    where("data", "==", dataHoje)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docExistente = snapshot.docs[0];

    await updateDoc(doc(db, "chamadas", docExistente.id), {
      alunoNome,
      alunoEmail: alunoEmail || "",
      status,
      observacao: observacao || "",
      atualizadoEm: serverTimestamp(),
    });

    return docExistente.id;
  }

  const docRef = await addDoc(chamadasCollection, {
    alunoId,
    alunoNome,
    alunoEmail: alunoEmail || "",
    status,
    observacao: observacao || "",
    data: dataHoje,
    atualizadoEm: serverTimestamp(),
  });

  return docRef.id;
}

export async function listarChamadasHoje() {
  const dataHoje = getDataHoje();

  const q = query(chamadasCollection, where("data", "==", dataHoje));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function buscarChamadaDoAlunoHoje(email) {
  if (!email) return null;

  const dataHoje = getDataHoje();

  const q = query(
    chamadasCollection,
    where("alunoEmail", "==", email),
    where("data", "==", dataHoje)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

export async function listarHistoricoChamadasDoAluno(email) {
  if (!email) return [];

  const q = query(chamadasCollection, where("alunoEmail", "==", email));
  const snapshot = await getDocs(q);

  const lista = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  return lista.sort((a, b) => {
    if (!a.data) return 1;
    if (!b.data) return -1;
    return b.data.localeCompare(a.data);
  });
}