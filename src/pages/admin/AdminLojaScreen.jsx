import { useEffect, useRef, useState } from "react";
import { Package, Upload } from "lucide-react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import {
  cadastrarProduto,
  listarProdutos,
  atualizarProduto,
  excluirProduto,
} from "../../services/produtoService";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function validarWhatsApp(valor) {
  if (!valor.trim()) return true;

  if (valor.startsWith("http://") || valor.startsWith("https://")) {
    return true;
  }

  const numero = valor.replace(/\D/g, "");
  return (
    numero.length === 10 ||
    numero.length === 11 ||
    numero.length === 12 ||
    numero.length === 13
  );
}

function validarConfiguracaoCloudinary() {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary não configurado. Verifique VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET no .env"
    );
  }
}

async function enviarImagemParaCloudinary(arquivo) {
  validarConfiguracaoCloudinary();

  if (!arquivo) return "";

  const formData = new FormData();
  formData.append("file", arquivo);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "nova-raiz/produtos");

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro Cloudinary:", data);
    throw new Error(
      data?.error?.message || "Erro ao enviar imagem para o Cloudinary."
    );
  }

  return data.secure_url;
}

async function criarAvisoAutomaticoProduto(nomeProduto, precoProduto) {
  const avisosCollection = collection(db, "avisos");

  // Remove o destaque dos avisos atuais
  const q = query(avisosCollection, where("destaque", "==", true));
  const snapshot = await getDocs(q);

  const promessas = snapshot.docs.map((item) =>
    updateDoc(doc(db, "avisos", item.id), {
      destaque: false,
    })
  );

  await Promise.all(promessas);

  // Cria o novo aviso de produto
  await addDoc(avisosCollection, {
    titulo: "Novo produto na loja",
    texto: precoProduto?.trim()
      ? `Novo produto disponível: ${nomeProduto} - ${precoProduto}`
      : `Novo produto disponível: ${nomeProduto}`,
    destaque: true,
    criadoEm: serverTimestamp(),
  });
}

export default function AdminLojaScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [linkWhatsapp, setLinkWhatsapp] = useState("");
  const [destaque, setDestaque] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [loadingLista, setLoadingLista] = useState(true);
  const [busca, setBusca] = useState("");

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editEstoque, setEditEstoque] = useState("");
  const [editLinkWhatsapp, setEditLinkWhatsapp] = useState("");
  const [editDestaque, setEditDestaque] = useState(false);
  const [editArquivo, setEditArquivo] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [editImagemUrlAtual, setEditImagemUrlAtual] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const areaEdicaoRef = useRef(null);
  const cardSelecionadoRef = useRef(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    function handleCliqueFora(event) {
      if (!produtoSelecionado) return;

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
  }, [produtoSelecionado]);

  async function carregarProdutos() {
    try {
      setLoadingLista(true);
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      setErro("Erro ao carregar produtos.");
    } finally {
      setLoadingLista(false);
    }
  }

  function limparFormularioCadastro() {
    setNome("");
    setPreco("");
    setEstoque("");
    setLinkWhatsapp("");
    setDestaque(false);
    setArquivo(null);
    setPreview("");
  }

  function limparFormularioEdicao() {
    setProdutoSelecionado(null);
    setEditNome("");
    setEditPreco("");
    setEditEstoque("");
    setEditLinkWhatsapp("");
    setEditDestaque(false);
    setEditArquivo(null);
    setEditPreview("");
    setEditImagemUrlAtual("");
  }

  function handleArquivoCadastro(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);
    setPreview(URL.createObjectURL(file));
    setErro("");
    setMensagem("");
  }

  function handleArquivoEdicao(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditArquivo(file);
    setEditPreview(URL.createObjectURL(file));
    setErro("");
    setMensagem("");
  }

  async function handleCadastrar() {
    setMensagem("");
    setErro("");

    if (!nome.trim() || !preco.trim()) {
      setErro("Preencha nome e preço.");
      return;
    }

    if (linkWhatsapp.trim() && !validarWhatsApp(linkWhatsapp.trim())) {
      setErro("Informe o WhatsApp no formato 81912345678 ou um link completo.");
      return;
    }

    try {
      setLoading(true);

      let imagemUrl = "";
      if (arquivo) {
        imagemUrl = await enviarImagemParaCloudinary(arquivo);
      }

      const nomeProduto = nome.trim();
      const precoProduto = preco.trim();

      await cadastrarProduto({
        nome: nomeProduto,
        preco: precoProduto,
        estoque: estoque.trim(),
        linkWhatsapp: linkWhatsapp.trim(),
        imagemUrl,
        destaque,
      });

      await criarAvisoAutomaticoProduto(nomeProduto, precoProduto);

      setMensagem("Produto cadastrado com sucesso e aviso criado automaticamente.");
      limparFormularioCadastro();
      await carregarProdutos();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setErro(error?.message || "Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  }

  function selecionarProduto(produto) {
    setProdutoSelecionado(produto);
    setEditNome(produto.nome || "");
    setEditPreco(produto.preco || "");
    setEditEstoque(produto.estoque || "");
    setEditLinkWhatsapp(produto.linkWhatsapp || "");
    setEditDestaque(!!produto.destaque);
    setEditArquivo(null);
    setEditPreview("");
    setEditImagemUrlAtual(produto.imagemUrl || "");
    setMensagem("");
    setErro("");
  }

  async function handleSalvarEdicao() {
    setMensagem("");
    setErro("");

    if (!produtoSelecionado) {
      setErro("Selecione um produto.");
      return;
    }

    if (!editNome.trim() || !editPreco.trim()) {
      setErro("Preencha nome e preço.");
      return;
    }

    if (editLinkWhatsapp.trim() && !validarWhatsApp(editLinkWhatsapp.trim())) {
      setErro("Informe o WhatsApp no formato 81912345678 ou um link completo.");
      return;
    }

    try {
      let imagemUrl = editImagemUrlAtual || "";

      if (editArquivo) {
        imagemUrl = await enviarImagemParaCloudinary(editArquivo);
      }

      await atualizarProduto(produtoSelecionado.id, {
        nome: editNome.trim(),
        preco: editPreco.trim(),
        estoque: editEstoque.trim(),
        linkWhatsapp: editLinkWhatsapp.trim(),
        imagemUrl,
        destaque: editDestaque,
      });

      setMensagem("Produto atualizado com sucesso.");
      await carregarProdutos();
      limparFormularioEdicao();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setErro(error?.message || "Erro ao atualizar produto.");
    }
  }

  async function handleExcluir() {
    setMensagem("");
    setErro("");

    if (!produtoSelecionado) {
      setErro("Selecione um produto para excluir.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir o produto "${produtoSelecionado.nome}"?`
    );

    if (!confirmar) return;

    try {
      await excluirProduto(produtoSelecionado.id);
      setMensagem("Produto excluído com sucesso.");
      limparFormularioEdicao();
      await carregarProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setErro("Erro ao excluir produto.");
    }
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = busca.toLowerCase();

    return (
      produto.nome?.toLowerCase().includes(termo) ||
      produto.preco?.toLowerCase().includes(termo) ||
      produto.estoque?.toLowerCase().includes(termo)
    );
  });

  return (
    <PhoneFrame title="Gerenciar Loja" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              Cadastrar produto
            </div>

            <Input
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <Input
              placeholder="Preço (ex: R$ 120,00)"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />

            <Input
              placeholder="Estoque / disponibilidade"
              value={estoque}
              onChange={(e) => setEstoque(e.target.value)}
            />

            <Input
              placeholder="WhatsApp (ex: 81912345678)"
              value={linkWhatsapp}
              onChange={(e) => setLinkWhatsapp(e.target.value)}
            />

            <div className="text-xs text-zinc-500">
              Pode informar só DDD + número. Exemplo: 81912345678
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-600">
                Foto do produto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleArquivoCadastro}
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

            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
              />
              Marcar como produto em destaque
            </label>

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button className="w-full h-11" onClick={handleCadastrar} disabled={loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? "Cadastrando..." : "Cadastrar produto"}
            </Button>
          </CardContent>
        </Card>

        <Input
          placeholder="Buscar produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {loadingLista ? (
          <div className="text-sm text-zinc-500">Carregando produtos...</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhum produto encontrado.</div>
        ) : (
          produtosFiltrados.map((produto) => (
            <Card
              key={produto.id}
              ref={produtoSelecionado?.id === produto.id ? cardSelecionadoRef : null}
              className={`cursor-pointer transition ${
                produtoSelecionado?.id === produto.id ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => selecionarProduto(produto)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                    {produto.imagemUrl ? (
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{produto.nome}</div>
                      <div className="text-sm text-zinc-500">
                        {produto.preco} {produto.estoque ? `• ${produto.estoque}` : ""}
                      </div>
                    </div>

                    {produto.destaque ? (
                      <Badge className="bg-red-100 text-red-700" variant="secondary">
                        destaque
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {produtoSelecionado && (
          <div ref={areaEdicaoRef}>
            <Card className="border-2 border-red-200">
              <CardContent className="p-5 space-y-4">
                <div className="font-semibold text-red-600">
                  Editar produto selecionado
                </div>

                <Input
                  placeholder="Nome"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                />

                <Input
                  placeholder="Preço"
                  value={editPreco}
                  onChange={(e) => setEditPreco(e.target.value)}
                />

                <Input
                  placeholder="Estoque / disponibilidade"
                  value={editEstoque}
                  onChange={(e) => setEditEstoque(e.target.value)}
                />

                <Input
                  placeholder="WhatsApp (ex: 81912345678)"
                  value={editLinkWhatsapp}
                  onChange={(e) => setEditLinkWhatsapp(e.target.value)}
                />

                <div className="text-xs text-zinc-500">
                  Pode informar só DDD + número. Exemplo: 81912345678
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-zinc-600">
                    Nova foto do produto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleArquivoEdicao}
                    className="block w-full text-sm text-zinc-600"
                  />
                </label>

                {editArquivo ? (
                  <div className="text-sm text-zinc-600">
                    Arquivo selecionado:{" "}
                    <span className="font-medium">{editArquivo.name}</span>
                  </div>
                ) : null}

                {editPreview ? (
                  <div className="rounded-2xl overflow-hidden border border-zinc-200">
                    <img
                      src={editPreview}
                      alt="Pré-visualização"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : editImagemUrlAtual ? (
                  <div className="rounded-2xl overflow-hidden border border-zinc-200">
                    <img
                      src={editImagemUrlAtual}
                      alt="Imagem atual"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : null}

                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={editDestaque}
                    onChange={(e) => setEditDestaque(e.target.checked)}
                  />
                  Marcar como produto em destaque
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
                    Excluir produto
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