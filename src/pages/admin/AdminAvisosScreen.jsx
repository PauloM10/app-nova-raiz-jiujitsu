import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import {
  cadastrarAviso,
  listarAvisos,
  atualizarAviso,
  excluirAviso,
} from "../../services/avisoService";

export default function AdminAvisosScreen({ goTo }) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [destaque, setDestaque] = useState(false);
  const [loading, setLoading] = useState(false);

  const [avisos, setAvisos] = useState([]);
  const [loadingLista, setLoadingLista] = useState(true);
  const [busca, setBusca] = useState("");

  const [avisoSelecionado, setAvisoSelecionado] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editTexto, setEditTexto] = useState("");
  const [editDestaque, setEditDestaque] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const areaEdicaoRef = useRef(null);
  const cardSelecionadoRef = useRef(null);

  useEffect(() => {
    carregarAvisos();
  }, []);

  useEffect(() => {
    function handleCliqueFora(event) {
      if (!avisoSelecionado) return;

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
    return () => document.removeEventListener("mousedown", handleCliqueFora);
  }, [avisoSelecionado]);

  async function carregarAvisos() {
    try {
      setLoadingLista(true);
      const dados = await listarAvisos();
      setAvisos(dados);
    } catch (error) {
      console.error("Erro ao listar avisos:", error);
      setErro("Erro ao carregar avisos.");
    } finally {
      setLoadingLista(false);
    }
  }

  function limparFormularioCadastro() {
    setTitulo("");
    setTexto("");
    setDestaque(false);
  }

  function limparFormularioEdicao() {
    setAvisoSelecionado(null);
    setEditTitulo("");
    setEditTexto("");
    setEditDestaque(false);
  }

  async function handleCadastrar() {
    setMensagem("");
    setErro("");

    if (!titulo.trim() || !texto.trim()) {
      setErro("Preencha título e texto.");
      return;
    }

    try {
      setLoading(true);

      await cadastrarAviso({
        titulo: titulo.trim(),
        texto: texto.trim(),
        destaque,
      });

      setMensagem("Aviso cadastrado com sucesso.");
      limparFormularioCadastro();
      await carregarAvisos();
    } catch (error) {
      console.error("Erro ao cadastrar aviso:", error);
      setErro("Erro ao cadastrar aviso.");
    } finally {
      setLoading(false);
    }
  }

  function selecionarAviso(aviso) {
    setAvisoSelecionado(aviso);
    setEditTitulo(aviso.titulo || "");
    setEditTexto(aviso.texto || "");
    setEditDestaque(!!aviso.destaque);
    setMensagem("");
    setErro("");
  }

  async function handleSalvarEdicao() {
    setMensagem("");
    setErro("");

    if (!avisoSelecionado) {
      setErro("Selecione um aviso.");
      return;
    }

    if (!editTitulo.trim() || !editTexto.trim()) {
      setErro("Preencha título e texto.");
      return;
    }

    try {
      await atualizarAviso(avisoSelecionado.id, {
        titulo: editTitulo.trim(),
        texto: editTexto.trim(),
        destaque: editDestaque,
      });

      setMensagem("Aviso atualizado com sucesso.");
      await carregarAvisos();
      limparFormularioEdicao();
    } catch (error) {
      console.error("Erro ao atualizar aviso:", error);
      setErro("Erro ao atualizar aviso.");
    }
  }

  async function handleExcluir() {
    setMensagem("");
    setErro("");

    if (!avisoSelecionado) {
      setErro("Selecione um aviso para excluir.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir o aviso "${avisoSelecionado.titulo}"?`
    );

    if (!confirmar) return;

    try {
      await excluirAviso(avisoSelecionado.id);
      setMensagem("Aviso excluído com sucesso.");
      limparFormularioEdicao();
      await carregarAvisos();
    } catch (error) {
      console.error("Erro ao excluir aviso:", error);
      setErro("Erro ao excluir aviso.");
    }
  }

  const avisosFiltrados = avisos.filter((aviso) => {
    const termo = busca.toLowerCase();

    return (
      aviso.titulo?.toLowerCase().includes(termo) ||
      aviso.texto?.toLowerCase().includes(termo)
    );
  });

  return (
    <PhoneFrame title="Gerenciar Avisos" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Cadastrar aviso
            </div>

            <Input
              placeholder="Título do aviso"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Texto do aviso"
              className="w-full rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700 outline-none min-h-[110px]"
            />

            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
              />
              Marcar como aviso em destaque
            </label>

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button className="w-full h-11" onClick={handleCadastrar} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar aviso"}
            </Button>
          </CardContent>
        </Card>

        <Input
          placeholder="Buscar aviso"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {loadingLista ? (
          <div className="text-sm text-zinc-500">Carregando avisos...</div>
        ) : avisosFiltrados.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhum aviso encontrado.</div>
        ) : (
          avisosFiltrados.map((aviso) => (
            <Card
              key={aviso.id}
              ref={avisoSelecionado?.id === aviso.id ? cardSelecionadoRef : null}
              className={`cursor-pointer transition ${
                avisoSelecionado?.id === aviso.id ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => selecionarAviso(aviso)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{aviso.titulo}</div>
                    <div className="text-sm text-zinc-500 mt-1">{aviso.texto}</div>
                  </div>

                  {aviso.destaque ? (
                    <Badge className="bg-red-100 text-red-700" variant="secondary">
                      destaque
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {avisoSelecionado && (
          <div ref={areaEdicaoRef}>
            <Card className="border-2 border-red-200">
              <CardContent className="p-5 space-y-4">
                <div className="font-semibold text-red-600">
                  Editar aviso selecionado
                </div>

                <Input
                  placeholder="Título"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                />

                <textarea
                  value={editTexto}
                  onChange={(e) => setEditTexto(e.target.value)}
                  placeholder="Texto do aviso"
                  className="w-full rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700 outline-none min-h-[110px]"
                />

                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={editDestaque}
                    onChange={(e) => setEditDestaque(e.target.checked)}
                  />
                  Marcar como aviso em destaque
                </label>

                {mensagem ? (
                  <div className="text-sm text-green-600 font-medium">{mensagem}</div>
                ) : null}

                {erro ? (
                  <div className="text-sm text-red-600 font-medium">{erro}</div>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleSalvarEdicao}>Salvar edição</Button>
                  <Button variant="outline" onClick={handleExcluir}>
                    Excluir aviso
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