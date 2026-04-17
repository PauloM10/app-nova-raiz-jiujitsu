import { useState } from "react";
import PhoneFrame from "../components/layout/PhoneFrame";
import NovaRaizLogo from "../components/layout/NovaRaizLogo";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";

import { login } from "../services/authService";
import { buscarUsuarioPorUid } from "../services/userService";

export default function LoginScreen({ onEnter, perfil, setPerfil, goTo }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleEnter = async () => {
    setErro("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await login(email, senha);
      const user = userCredential.user;

      const dadosUsuario = await buscarUsuarioPorUid(user.uid);

      onEnter({
        uid: user.uid,
        email: user.email,
        perfil: dadosUsuario.perfil,
        nome: dadosUsuario.nome || "",
      });
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("E-mail ou senha inválidos, ou usuário não encontrado no sistema.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneFrame title="Login">
      <div className="p-6">
        <div className="rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-black text-white p-6 shadow-[0_16px_40px_rgba(220,38,38,0.28)]">
          <div className="flex justify-center mb-4">
            <NovaRaizLogo size="large" />
          </div>

          <Badge className="bg-white/20 text-white border-0 mb-3">
            Login real
          </Badge>

          <h1 className="text-2xl font-bold">Nova Raiz Jiu-jitsu</h1>

          <p className="text-sm text-red-50 mt-2">
            Aplicativo para alunos acompanharem treinos, vídeos, avisos,
            presença e loja da academia.
          </p>
        </div>

        <Card className="mt-6 rounded-3xl border-0 shadow-md">
          <CardContent className="space-y-4 p-5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-2xl py-2 text-sm font-medium ${
                  perfil === "aluno"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
                onClick={() => setPerfil("aluno")}
              >
                Perfil Aluno
              </button>

              <button
                type="button"
                className={`rounded-2xl py-2 text-sm font-medium ${
                  perfil === "professor"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
                onClick={() => setPerfil("professor")}
              >
                Perfil Professor
              </button>
            </div>

            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button
              className="w-full h-11 mt-6"
              onClick={handleEnter}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Acessar aplicativo"}
            </Button>

            <button
              type="button"
              onClick={() => goTo("esqueci_senha")}
              className="w-full text-center text-sm text-red-600 hover:underline mt-2"
            >
              Esqueci minha senha
            </button>
          </CardContent>
        </Card>
      </div>
    </PhoneFrame>
  );
}