import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const videosCollection = collection(db, "videos");
const configRef = doc(db, "configuracoes", "videos");

const CATEGORIAS_PADRAO = [
  "Categoria 1",
  "Categoria 2",
  "Categoria 3",
  "Categoria 4",
  "Categoria 5",
];

export async function buscarCategoriasVideos() {
  const snap = await getDoc(configRef);

  if (!snap.exists()) {
    return CATEGORIAS_PADRAO;
  }

  const dados = snap.data();
  const categorias = Array.isArray(dados.categorias) ? dados.categorias : [];

  if (categorias.length !== 5) {
    return CATEGORIAS_PADRAO;
  }

  return categorias;
}

export async function salvarCategoriasVideos(categorias) {
  const categoriasTratadas = categorias.map((item, index) => {
    const valor = (item || "").trim();
    return valor || `Categoria ${index + 1}`;
  });

  await setDoc(
    configRef,
    {
      categorias: categoriasTratadas,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function cadastrarVideo(dadosVideo) {
  const payload = {
    titulo: dadosVideo.titulo,
    link: dadosVideo.link,
    descricao: dadosVideo.descricao || "",
    categoria: dadosVideo.categoria || "",
    criadoEm: serverTimestamp(),
  };

  const docRef = await addDoc(videosCollection, payload);
  return docRef;
}

export async function listarVideos() {
  const snapshot = await getDocs(query(videosCollection));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function atualizarVideo(id, dadosVideo) {
  await updateDoc(doc(db, "videos", id), {
    titulo: dadosVideo.titulo,
    link: dadosVideo.link,
    descricao: dadosVideo.descricao || "",
    categoria: dadosVideo.categoria || "",
  });
}

export async function excluirVideo(id) {
  await deleteDoc(doc(db, "videos", id));
}