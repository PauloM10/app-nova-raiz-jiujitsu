import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function buscarUsuarioPorUid(uid) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Usuário não encontrado no Firestore.");
  }

  return snap.data();
}