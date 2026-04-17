import { useState } from "react";
import { Mail } from "lucide-react";
import PhoneFrame from "../components/layout/PhoneFrame";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { recuperarSenha } from "../services/authService";

export default function EsqueciSenhaScreen({ goTo }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function handleRecuperar() {
    setMensagem("");
    setErro("");

    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }

    try {
      setLoading(true);
      await recuperarSenha(email.trim());
      setMensagem("Enviamos um link de recuperação para o seu e-mail.");
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);

      if (error?.code === "auth/user-not-found") {
        setErro("Não existe usuário com esse e-mail.");
      } else if (error?.code === "auth/invalid-email") {
        setErro("Informe um e-mail válido.");
      } else {
        setErro("Erro ao enviar recuperação de senha.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneFrame title="Recuperar senha" showBack onBack={() => goTo("login")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-600" />
              Esqueci minha senha
            </div>

            <div className="text-sm text-zinc-600">
              Informe seu e-mail para receber o link de redefinição de senha.
            </div>

            <Input
              placeholder="Seu e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button className="w-full h-11" onClick={handleRecuperar} disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PhoneFrame>
  );
}