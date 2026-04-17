import { useState } from "react";
import { PlusCircle, KeyRound } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { cadastrarProfessor } from "../../services/professorService";

export default function AdminCadastroProfessorScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const limparFormulario = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setSenha("");
  };

  const handleCadastrar = async () => {
    setMensagem("");
    setErro("");

    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const senhaFinal = senha.trim() || "123456";

      await cadastrarProfessor({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        senha: senhaFinal,
      });

      setMensagem(
        `Professor cadastrado com sucesso. Login: ${email.trim()} | Senha inicial: ${senhaFinal}`
      );

      limparFormulario();
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);

      if (error?.code === "auth/email-already-in-use") {
        setErro("Esse e-mail já está cadastrado.");
      } else if (error?.code === "auth/invalid-email") {
        setErro("Informe um e-mail válido.");
      } else if (error?.code === "auth/weak-password") {
        setErro("A senha precisa ter pelo menos 6 caracteres.");
      } else {
        setErro(error?.message || "Erro ao cadastrar professor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneFrame title="Cadastrar Professor" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-red-600" />
              Cadastro de professor/admin
            </div>

            <Input
              placeholder="Nome completo do professor"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <div className="space-y-2">
              <div className="font-medium text-sm flex items-center gap-2 text-zinc-700">
                <KeyRound className="h-4 w-4 text-red-600" />
                Senha inicial do professor
              </div>

              <Input
                placeholder="Deixe vazio para usar 123456"
                type="text"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <div className="text-xs text-zinc-500">
                Se deixar em branco, o sistema vai cadastrar com a senha padrão 123456.
              </div>
            </div>

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button className="w-full h-11" onClick={handleCadastrar} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar professor"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PhoneFrame>
  );
}