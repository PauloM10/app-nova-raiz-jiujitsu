import { useState } from "react";
import {
  Star,
  ClipboardCheck,
  LogOut,
  Shield,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import NovaRaizLogo from "../../components/layout/NovaRaizLogo";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { logout, alterarSenha } from "../../services/authService";

export default function PerfilAlunoScreen({
  goTo,
  usuario,
  voltarProfessor,
}) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarAlterarSenha, setMostrarAlterarSenha] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const handleAlterarSenha = async () => {
    setMensagem("");
    setErro("");

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setErro("Preencha os dois campos de senha.");
      return;
    }

    if (novaSenha.trim().length < 6) {
      setErro("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setLoadingSenha(true);

      await alterarSenha(novaSenha.trim());

      setMensagem("Senha alterada com sucesso.");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);

      if (error?.code === "auth/requires-recent-login") {
        setErro("Por segurança, faça login novamente antes de alterar a senha.");
      } else if (error?.code === "auth/weak-password") {
        setErro("A nova senha é muito fraca.");
      } else {
        setErro("Erro ao alterar senha.");
      }
    } finally {
      setLoadingSenha(false);
    }
  };

  const ehProfessor = usuario?.perfil === "professor";

  return (
    <PhoneFrame title="Perfil">
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <NovaRaizLogo size="large" />
            </div>

            <div className="text-xl font-bold">
              {usuario?.nome || "Aluno Exemplo"}
            </div>
            <div className="text-sm text-zinc-500">
              {usuario?.email || "aluno@novaraiz.com"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">E-mail</span>
              <span>{usuario?.email || "aluno@novaraiz.com"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Perfil</span>
              <span>{usuario?.perfil || "aluno"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Nome</span>
              <span>{usuario?.nome || "Aluno Exemplo"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <button
              type="button"
              onClick={() => setMostrarAlterarSenha(!mostrarAlterarSenha)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="font-semibold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-red-600" />
                Alterar senha
              </div>

              {mostrarAlterarSenha ? (
                <ChevronUp className="h-5 w-5 text-zinc-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-zinc-500" />
              )}
            </button>

            {mostrarAlterarSenha ? (
              <div className="space-y-4">
                <Input
                  placeholder="Nova senha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />

                <Input
                  placeholder="Confirmar nova senha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                {mensagem ? (
                  <div className="text-sm text-green-600 font-medium">
                    {mensagem}
                  </div>
                ) : null}

                {erro ? (
                  <div className="text-sm text-red-600 font-medium">{erro}</div>
                ) : null}

                <Button
                  className="w-full h-11"
                  onClick={handleAlterarSenha}
                  disabled={loadingSenha}
                >
                  {loadingSenha ? "Alterando..." : "Alterar senha"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full h-11"
          onClick={() => goTo("sobre")}
        >
          <Star className="h-4 w-4 mr-2" />
          Sobre a academia
        </Button>

        <Button
          variant="outline"
          className="w-full h-11"
          onClick={() => goTo("chamada")}
        >
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Minha chamada e observações
        </Button>

        {ehProfessor ? (
          <Button className="w-full h-11" onClick={voltarProfessor}>
            <Shield className="h-4 w-4 mr-2" />
            Voltar ao painel do professor
          </Button>
        ) : null}

        <Button
          variant="outline"
          className="w-full h-11"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>

        <BottomNav current="perfil" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}