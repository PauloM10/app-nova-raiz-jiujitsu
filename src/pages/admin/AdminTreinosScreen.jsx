import { useEffect, useRef, useState } from "react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { CalendarDays } from "lucide-react";
import {
  cadastrarTreino,
  listarTreinos,
  atualizarTreino,
  excluirTreino,
} from "../../services/treinoService";

export default function AdminTreinosScreen({ goTo }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [turma, setTurma] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [treinos, setTreinos] = useState([]);
  const [loadingLista, setLoadingLista] = useState(true);

  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editData, setEditData] = useState("");
  const [editHorario, setEditHorario] = useState("");
  const [editTurma, setEditTurma] = useState("");

  const areaEdicaoRef = useRef(null);
  const cardSelecionadoRef = useRef(null);

  const limparFormularioCadastro = () => {
    setTitulo("");
    setDescricao("");
    setData("");
    setHorario("");
    setTurma("");
  };

  const limparFormularioEdicao = () => {
    setTreinoSelecionado(null);
    setEditTitulo("");
    setEditDescricao("");
    setEditData("");
    setEditHorario("");
    setEditTurma("");
  };

  async function carregarTreinos() {
    try {
      setLoadingLista(true);
      const dados = await listarTreinos();
      setTreinos(dados);
    } catch (error) {
      console.error("Erro ao listar treinos:", error);
      setErro("Erro ao carregar treinos.");
    } finally {
      setLoadingLista(false);
    }
  }

  useEffect(() => {
    carregarTreinos();
  }, []);

  useEffect(() => {
    function handleCliqueFora(event) {
      if (!treinoSelecionado) return;

      const clicouNaAreaEdicao =
        areaEdicaoRef.current &&
        areaEdicaoRef.current.contains(event.target);

      const clicouNoCardSelecionado =
        cardSelecionadoRef.current &&
        cardSelecionadoRef.current.contains(event.target);

      if (!clicouNaAreaEdicao && !clicouNoCardSelecionado) {
        limparFormularioEdicao();
      }
    }

    document.addEventListener("mousedown", handleCliqueFora);

    return () => {
      document.removeEventListener("mousedown", handleCliqueFora);
    };
  }, [treinoSelecionado]);

  const handleCadastrar = async () => {
    setMensagem("");
    setErro("");

    if (!titulo.trim() || !data || !horario || !turma.trim()) {
      setErro("Preencha título, data, horário e turma.");
      return;
    }

    try {
      setLoading(true);

      await cadastrarTreino({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data,
        horario,
        turma: turma.trim(),
      });

      setMensagem("Treino cadastrado com sucesso.");
      limparFormularioCadastro();
      await carregarTreinos();
    } catch (error) {
      console.error("Erro ao cadastrar treino:", error);
      setErro("Erro ao cadastrar treino.");
    } finally {
      setLoading(false);
    }
  };

  const selecionarTreino = (treino) => {
    setTreinoSelecionado(treino);
    setEditTitulo(treino.titulo || "");
    setEditDescricao(treino.descricao || "");
    setEditData(treino.data || "");
    setEditHorario(treino.horario || "");
    setEditTurma(treino.turma || "");
    setMensagem("");
    setErro("");
  };

  const handleSalvarEdicao = async () => {
    setMensagem("");
    setErro("");

    if (!treinoSelecionado) {
      setErro("Selecione um treino.");
      return;
    }

    if (!editTitulo.trim() || !editDescricao.trim() || !editData || !editHorario || !editTurma.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      await atualizarTreino(treinoSelecionado.id, {
        titulo: editTitulo.trim(),
        descricao: editDescricao.trim(),
        data: editData,
        horario: editHorario,
        turma: editTurma.trim(),
      });

      setMensagem("Treino atualizado com sucesso.");
      await carregarTreinos();
      limparFormularioEdicao();
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
      setErro("Erro ao atualizar treino.");
    }
  };

  const handleExcluir = async () => {
    setMensagem("");
    setErro("");

    if (!treinoSelecionado) {
      setErro("Selecione um treino para excluir.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir o treino "${treinoSelecionado.titulo}"?`
    );

    if (!confirmar) return;

    try {
      await excluirTreino(treinoSelecionado.id);
      setMensagem("Treino excluído com sucesso.");
      limparFormularioEdicao();
      await carregarTreinos();
    } catch (error) {
      console.error("Erro ao excluir treino:", error);
      setErro("Erro ao excluir treino.");
    }
  };

  const treinosFiltrados = treinos.filter((treino) => {
    const termo = busca.toLowerCase();

    return (
      treino.titulo?.toLowerCase().includes(termo) ||
      treino.descricao?.toLowerCase().includes(termo) ||
      treino.turma?.toLowerCase().includes(termo) ||
      treino.data?.toLowerCase().includes(termo) ||
      treino.horario?.toLowerCase().includes(termo)
    );
  });

  return (
    <PhoneFrame title="Gerenciar Treinos" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-red-600" />
              Cadastro de treino
            </div>

            <Input
              placeholder="Título do treino"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <Input
              placeholder="Descrição do treino"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <Input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />

            <Input
              placeholder="Turma"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
            />

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button className="w-full h-11" onClick={handleCadastrar} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar treino"}
            </Button>
          </CardContent>
        </Card>

        <Input
          placeholder="Buscar treino"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {loadingLista ? (
          <div className="text-sm text-zinc-500">Carregando treinos...</div>
        ) : treinosFiltrados.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhum treino encontrado.</div>
        ) : (
          treinosFiltrados.map((treino) => (
            <Card
              key={treino.id}
              ref={treinoSelecionado?.id === treino.id ? cardSelecionadoRef : null}
              className={`cursor-pointer transition ${
                treinoSelecionado?.id === treino.id ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => selecionarTreino(treino)}
            >
              <CardContent className="p-4">
                <div className="space-y-1">
                  <div className="font-semibold">{treino.titulo}</div>
                  <div className="text-sm text-zinc-500">{treino.descricao}</div>
                  <div className="text-xs text-zinc-400">
                    {treino.data} • {treino.horario} • Turma {treino.turma}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {treinoSelecionado && (
          <div ref={areaEdicaoRef}>
            <Card className="border-2 border-red-200">
              <CardContent className="p-5 space-y-4">
                <div className="font-semibold text-red-600">
                  Editar treino selecionado
                </div>

                <Input
                  placeholder="Título"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                />

                <Input
                  placeholder="Descrição"
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                />

                <Input
                  type="date"
                  value={editData}
                  onChange={(e) => setEditData(e.target.value)}
                />

                <Input
                  type="time"
                  value={editHorario}
                  onChange={(e) => setEditHorario(e.target.value)}
                />

                <Input
                  placeholder="Turma"
                  value={editTurma}
                  onChange={(e) => setEditTurma(e.target.value)}
                />

                {mensagem ? (
                  <div className="text-sm text-green-600 font-medium">{mensagem}</div>
                ) : null}

                {erro ? (
                  <div className="text-sm text-red-600 font-medium">{erro}</div>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleSalvarEdicao}>Salvar edição</Button>
                  <Button variant="outline" onClick={handleExcluir}>
                    Excluir treino
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