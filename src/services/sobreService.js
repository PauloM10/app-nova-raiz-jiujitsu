import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const SOBRE_DOC_ID = "sobre_academia";

export async function buscarSobreAcademia() {
  const ref = doc(db, "configuracoes", SOBRE_DOC_ID);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      titulo: "Sobre a academia",
      texto:
        "A Nova Raiz Jiu-jitsu é um projeto que busca transformar vidas por meio da disciplina, da fé, do respeito e do desenvolvimento técnico dentro e fora do tatame.",
      pdfTitulo: "Baixar e-book da academia",
      pdfUrl: "/documentos/ebook-nova-raiz.pdf",
    };
  }

  return snap.data();
}

export async function salvarSobreAcademia(dados) {
  const ref = doc(db, "configuracoes", SOBRE_DOC_ID);

  await setDoc(
    ref,
    {
      titulo: dados.titulo,
      texto: dados.texto,
      pdfTitulo: dados.pdfTitulo || "Baixar e-book da academia",
      pdfUrl: dados.pdfUrl || "/documentos/ebook-nova-raiz.pdf",
      atualizadoEm: serverTimestamp(),
    },
    { merge: true }
  );
}