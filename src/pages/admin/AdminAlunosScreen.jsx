import { useEffect, useRef, useState } from "react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
  listarAlunos,
  atualizarAluno,
  excluirAluno,
} from "../../services/alunoService";

export default function AdminAlunosScreen({ goTo }) {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [faixa, setFaixa] = useState("");
  const [turma, setTurma] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const areaEdicaoRef = useRef(null);
  const cardSelecionadoRef = useRef(null);

  async function carregarAlunos() {
    try {
      setLoading(true);
      const dados = await listarAlunos();
      setAlunos(dados);
    } catch (error) {
      console.error("Erro ao listar alunos:", error);
      setErro("Erro ao carregar alunos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  useEffect(() => {
    function handleCliqueFora(event) {
      if (!alunoSelecionado) return;

      const clicouNaAreaEdicao =
        areaEdicaoRef.current &&
        areaEdicaoRef.current.contains(event.target);

      const clicouNoCardSelecionado =
        cardSelecionadoRef.current &&
        cardSelecionadoRef.current.contains(event.target);

      if (!clicouNaAreaEdicao && !clicouNoCardSelecionado) {
        limparFormulario();
      }
    }

    document.addEventListener("mousedown", handleCliqueFora);

    return () => {
      document.removeEventListener("mousedown", handleCliqueFora);
    };
  }, [alunoSelecionado]);

  const selecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
    setNome(aluno.nome || "");
    setEmail(aluno.email || "");
    setTelefone(aluno.telefone || "");
    setFaixa(aluno.faixa || "");
    setTurma(aluno.turma || "");
    setMensagem("");
    setErro("");
  };

  const limparFormulario = () => {
    setAlunoSelecionado(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setFaixa("");
    setTurma("");
    setMensagem("");
    setErro("");
  };

  const handleSalvarEdicao = async () => {
    setMensagem("");
    setErro("");

    if (!alunoSelecionado) {
      setErro("Selecione um aluno.");
      return;
    }

    if (!nome || !email || !telefone || !faixa || !turma) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      await atualizarAluno(alunoSelecionado.id, {
        nome,
        email,
        telefone,
        faixa,
        turma,
      });

      setMensagem("Aluno atualizado com sucesso.");
      await carregarAlunos();
      limparFormulario();
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      setErro("Erro ao atualizar aluno.");
    }
  };

  const handleExcluir = async () => {
    setMensagem("");
    setErro("");

    if (!alunoSelecionado) {
      setErro("Selecione um aluno para excluir.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir o aluno "${alunoSelecionado.nome}"?`
    );

    if (!confirmar) return;

    try {
      await excluirAluno(alunoSelecionado.id);
      setMensagem("Aluno excluído com sucesso.");
      limparFormulario();
      await carregarAlunos();
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      setErro("Erro ao excluir aluno.");
    }
  };

  const alunosFiltrados = alunos.filter((aluno) => {
    const termo = busca.toLowerCase();

    return (
      aluno.nome?.toLowerCase().includes(termo) ||
      aluno.email?.toLowerCase().includes(termo) ||
      aluno.turma?.toLowerCase().includes(termo) ||
      aluno.faixa?.toLowerCase().includes(termo)
    );
  });

  return (
    <PhoneFrame
      title="Lista de Alunos"
      showBack
      onBack={() => goTo("admin_home")}
    >
      <div className="p-4 space-y-4">
        <Input
          placeholder="Buscar aluno"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {loading ? (
          <div className="text-sm text-zinc-500">Carregando alunos...</div>
        ) : alunosFiltrados.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhum aluno encontrado.</div>
        ) : (
          alunosFiltrados.map((aluno) => (
            <Card
              key={aluno.id}
              ref={alunoSelecionado?.id === aluno.id ? cardSelecionadoRef : null}
              className={`cursor-pointer transition ${
                alunoSelecionado?.id === aluno.id ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => {
                console.log("Aluno clicado:", aluno);
                selecionarAluno(aluno);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{aluno.nome}</div>
                    <div className="text-sm text-zinc-500">
                      Faixa {aluno.faixa} • Turma {aluno.turma}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {aluno.email}
                    </div>
                  </div>

                  <Badge
                    className="bg-green-100 text-green-700"
                    variant="secondary"
                  >
                    ativo
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {alunoSelecionado && (
          <div ref={areaEdicaoRef}>
            <Card className="border-2 border-red-200">
              <CardContent className="p-5 space-y-4">
                <div className="font-semibold text-red-600">
                  Editar aluno selecionado
                </div>

                <Input
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />

                <Input
                  placeholder="E-mail"
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

                {mensagem ? (
                  <div className="text-sm text-green-600 font-medium">
                    {mensagem}
                  </div>
                ) : null}

                {erro ? (
                  <div className="text-sm text-red-600 font-medium">{erro}</div>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleSalvarEdicao}>Salvar edição</Button>
                  <Button variant="outline" onClick={handleExcluir}>
                    Excluir aluno
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}