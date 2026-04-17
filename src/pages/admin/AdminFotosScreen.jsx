import { useEffect, useState } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { cadastrarFoto, listarFotos, excluirFoto } from "../../services/fotoService";

export default function AdminFotosScreen({ goTo }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // 🔥 NOVO - filtro
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  const categorias = ["todas", "Treinos", "Eventos", "Campeonato"];

  async function carregarFotos() {
    try {
      const dados = await listarFotos();
      setFotos(dados);
    } catch (error) {
      console.error("Erro ao listar fotos:", error);
      setErro("Erro ao carregar fotos.");
    }
  }

  useEffect(() => {
    carregarFotos();
  }, []);

  const limparFormulario = () => {
    setTitulo("");
    setCategoria("");
    setArquivo(null);
    setPreview("");
  };

  const handleArquivo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setArquivo(file);
    setPreview(URL.createObjectURL(file));
    setErro("");
    setMensagem("");
  };

  const handleCadastrar = async () => {
    setMensagem("");
    setErro("");

    if (!categoria.trim()) {
      setErro("Informe a categoria da foto.");
      return;
    }

    if (!arquivo) {
      setErro("Escolha uma imagem antes de adicionar.");
      return;
    }

    try {
      setLoading(true);

      await cadastrarFoto({
      arquivo,
      titulo: titulo.trim(),
      categoria: categoria.trim(),
      });

      setMensagem("Foto enviada com sucesso.");
      limparFormulario();
      await carregarFotos();
    } catch (error) {
      console.error("Erro ao cadastrar foto:", error);
      setErro(
        error?.message
          ? `Erro ao enviar foto: ${error.message}`
          : "Erro ao enviar foto."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    const confirmarExclusao = window.confirm(
      "Deseja realmente excluir essa foto?"
    );

    if (!confirmarExclusao) return;

    try {
      setErro("");
      setMensagem("");

      await excluirFoto(id);
      await carregarFotos();

      setMensagem("Foto excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
      setErro("Erro ao excluir foto.");
    }
  };

  // 🔥 FILTRO APLICADO
  const fotosFiltradas =
    filtroCategoria === "todas"
      ? fotos
      : fotos.filter((foto) => foto.categoria === filtroCategoria);

  return (
    <PhoneFrame
      title="Gerenciar Fotos"
      showBack
      onBack={() => goTo("admin_home")}
    >
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-red-600" />
              Adicionar novas fotos
            </div>

            <Input
              placeholder="Título da foto"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <Input
              placeholder="Categoria (Treinos, Eventos, Campeonato)"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-600">
                Escolher imagem
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleArquivo}
                className="block w-full text-sm text-zinc-600"
              />
            </label>

            {arquivo ? (
              <div className="text-sm text-zinc-600">
                Arquivo selecionado:{" "}
                <span className="font-medium">{arquivo.name}</span>
              </div>
            ) : null}

            {preview ? (
              <div className="rounded-2xl overflow-hidden border border-zinc-200">
                <img
                  src={preview}
                  alt="Pré-visualização"
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : null}

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
              onClick={handleCadastrar}
              disabled={loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? "Enviando..." : "Adicionar foto"}
            </Button>
          </CardContent>
        </Card>

        {/* 🔥 FILTRO VISUAL */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-3 py-1 rounded-full text-sm border ${
                filtroCategoria === cat
                  ? "bg-red-600 text-white"
                  : "bg-white text-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🔥 LISTA DE FOTOS */}
        <div className="grid grid-cols-2 gap-3">
          {fotosFiltradas.map((foto) => (
            <div
              key={foto.id}
              className="rounded-3xl overflow-hidden bg-white shadow-sm border border-zinc-100"
            >
              <div className="h-24 bg-zinc-100">
                <img
                  src={foto.url}
                  alt={foto.titulo}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-3">
                {foto.titulo && (
                  <div className="font-medium text-sm">
                    {foto.titulo}
              </div>
           )}
                <div className="text-xs text-zinc-500 mt-1">
                  {foto.categoria}
                </div>

                <button
                  onClick={() => handleExcluir(foto.id)}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}