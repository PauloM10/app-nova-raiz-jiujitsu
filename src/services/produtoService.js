import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const produtosCollection = collection(db, "produtos");

export async function cadastrarProduto(dadosProduto) {
  const payload = {
    nome: dadosProduto.nome,
    preco: dadosProduto.preco,
    estoque: dadosProduto.estoque || "",
    linkWhatsapp: dadosProduto.linkWhatsapp || "",
    imagemUrl: dadosProduto.imagemUrl || "",
    destaque: !!dadosProduto.destaque,
    criadoEm: serverTimestamp(),
  };

  if (payload.destaque) {
    await removerDestaqueDosOutrosProdutos();
  }

  const docRef = await addDoc(produtosCollection, payload);
  return docRef;
}

export async function listarProdutos() {
  const snapshot = await getDocs(query(produtosCollection));

  const produtos = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  produtos.sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
  return produtos;
}

export async function atualizarProduto(id, dadosProduto) {
  if (dadosProduto.destaque) {
    await removerDestaqueDosOutrosProdutos(id);
  }

  await updateDoc(doc(db, "produtos", id), {
    nome: dadosProduto.nome,
    preco: dadosProduto.preco,
    estoque: dadosProduto.estoque || "",
    linkWhatsapp: dadosProduto.linkWhatsapp || "",
    imagemUrl: dadosProduto.imagemUrl || "",
    destaque: !!dadosProduto.destaque,
  });
}

export async function excluirProduto(id) {
  await deleteDoc(doc(db, "produtos", id));
}

export async function buscarProdutoDestaque() {
  const q = query(produtosCollection, where("destaque", "==", true));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const item = snapshot.docs[0];
  return {
    id: item.id,
    ...item.data(),
  };
}

async function removerDestaqueDosOutrosProdutos(idAtual = null) {
  const q = query(produtosCollection, where("destaque", "==", true));
  const snapshot = await getDocs(q);

  const promessas = snapshot.docs
    .filter((item) => item.id !== idAtual)
    .map((item) =>
      updateDoc(doc(db, "produtos", item.id), {
        destaque: false,
      })
    );

  await Promise.all(promessas);
}