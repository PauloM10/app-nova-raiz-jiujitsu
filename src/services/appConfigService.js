import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function buscarConfigApp() {
  try {
    const ref = doc(db, "configuracoes", "app");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return {
        appAtivo: true,
        mensagem: "Aplicativo temporariamente indisponível. Tente novamente mais tarde.",
      };
    }

    const dados = snap.data();

    return {
      appAtivo: dados.appAtivo !== false,
      mensagem:
        dados.mensagem ||
        "Aplicativo temporariamente indisponível. Tente novamente mais tarde.",
    };
  } catch (error) {
    console.error("Erro ao buscar configuração do app:", error);

    return {
      appAtivo: true,
      mensagem: "Aplicativo temporariamente indisponível. Tente novamente mais tarde.",
    };
  }
}