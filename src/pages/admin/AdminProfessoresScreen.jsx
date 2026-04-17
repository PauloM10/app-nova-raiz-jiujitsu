import { useEffect, useRef, useState } from "react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
  listarProfessores,
  atualizarProfessor,
  excluirProfessor,
} from "../../services/professorService";

export default function AdminProfessoresScreen({ goTo }) {
  const [busca, setBusca] = useState("");
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [professorSelecionado, setProfessorSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const areaEdicaoRef = useRef(null);
  const cardSelecionadoRef = useRef(null);

  async function carregarProfessores() {
    try {
      setLoading(true);
      const dados = await listarProfessores();
      setProfessores(dados);
    } catch (error) {
      console.error("Erro ao listar professores:", error);
      setErro("Erro ao carregar professores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProfessores();
  }, []);

  useEffect(() => {
    function handleCliqueFora(event) {
      if (!professorSelecionado) return;

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
  }, [professorSelecionado]);

  const selecionarProfessor = (professor) => {
    setProfessorSelecionado(professor);
    setNome(professor.nome || "");
    setEmail(professor.email || "");
    setTelefone(professor.telefone || "");
    setMensagem("");
    setErro("");
  };

  const limparFormulario = () => {
    setProfessorSelecionado(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setMensagem("");
    setErro("");
  };

  const handleSalvarEdicao = async () => {
    setMensagem("");
    setErro("");

    if (!professorSelecionado) {
      setErro("Selecione um professor.");
      return;
    }

    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      await atualizarProfessor(professorSelecionado.id, {
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
      });

      setMensagem("Professor atualizado com sucesso.");
      await carregarProfessores();
      limparFormulario();
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      setErro("Erro ao atualizar professor.");
    }
  };

  const handleExcluir = async () => {
    setMensagem("");
    setErro("");

    if (!professorSelecionado) {
      setErro("Selecione um professor para excluir.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir o professor "${professorSelecionado.nome}"?`
    );

    if (!confirmar) return;

    try {
      await excluirProfessor(professorSelecionado.id);
      setMensagem("Professor excluído com sucesso.");
      limparFormulario();
      await carregarProfessores();
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
      setErro("Erro ao excluir professor.");
    }
  };

  const professoresFiltrados = professores.filter((professor) => {
    const termo = busca.toLowerCase();

    return (
      professor.nome?.toLowerCase().includes(termo) ||
      professor.email?.toLowerCase().includes(termo) ||
      professor.telefone?.toLowerCase().includes(termo)
    );
  });

  return (
    <PhoneFrame
      title="Lista de Professores"
      showBack
      onBack={() => goTo("admin_home")}
    >
      <div className="p-4 space-y-4">
        <Input
          placeholder="Buscar professor"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {loading ? (
          <div className="text-sm text-zinc-500">Carregando professores...</div>
        ) : professoresFiltrados.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhum professor encontrado.</div>
        ) : (
          professoresFiltrados.map((professor) => (
            <Card
              key={professor.id}
              ref={
                professorSelecionado?.id === professor.id
                  ? cardSelecionadoRef
                  : null
              }
              className={`cursor-pointer transition ${
                professorSelecionado?.id === professor.id
                  ? "ring-2 ring-red-500"
                  : ""
              }`}
              onClick={() => selecionarProfessor(professor)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{professor.nome}</div>
                    <div className="text-sm text-zinc-500">{professor.telefone}</div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {professor.email}
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

        {professorSelecionado && (
          <div ref={areaEdicaoRef}>
            <Card className="border-2 border-red-200">
              <CardContent className="p-5 space-y-4">
                <div className="font-semibold text-red-600">
                  Editar professor selecionado
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
                    Excluir professor
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