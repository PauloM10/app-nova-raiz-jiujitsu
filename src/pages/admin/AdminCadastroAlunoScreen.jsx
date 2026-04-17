import { useState } from "react";
import { PlusCircle, KeyRound } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { cadastrarAluno } from "../../services/alunoService";

export default function AdminCadastroAlunoScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [faixa, setFaixa] = useState("");
  const [turma, setTurma] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const limparFormulario = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setFaixa("");
    setTurma("");
    setSenha("");
  };

  const handleCadastrar = async () => {
    setMensagem("");
    setErro("");

    if (!nome.trim() || !email.trim() || !telefone.trim() || !faixa.trim() || !turma.trim()) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const senhaFinal = senha.trim() || "123456";

      await cadastrarAluno({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        faixa: faixa.trim(),
        turma: turma.trim(),
        senha: senhaFinal,
      });

      setMensagem(
        `Aluno cadastrado com sucesso. Login: ${email.trim()} | Senha inicial: ${senhaFinal}`
      );

      limparFormulario();
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);

      if (error?.code === "auth/email-already-in-use") {
        setErro("Esse e-mail já está cadastrado.");
      } else if (error?.code === "auth/invalid-email") {
        setErro("Informe um e-mail válido.");
      } else if (error?.code === "auth/weak-password") {
        setErro("A senha precisa ter pelo menos 6 caracteres.");
      } else {
        setErro(error?.message || "Erro ao cadastrar aluno.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneFrame title="Cadastrar Aluno" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-red-600" />
              Cadastro real no banco
            </div>

            <Input
              placeholder="Nome completo do aluno"
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

            <Input
              placeholder="Faixa"
              value={faixa}
              onChange={(e) => setFaixa(e.target.value)}
            />

            <Input
              placeholder="Turma"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
            />

            <div className="space-y-2">
              <div className="font-medium text-sm flex items-center gap-2 text-zinc-700">
                <KeyRound className="h-4 w-4 text-red-600" />
                Senha inicial do aluno
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
              {loading ? "Cadastrando..." : "Cadastrar aluno"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PhoneFrame>
  );
}