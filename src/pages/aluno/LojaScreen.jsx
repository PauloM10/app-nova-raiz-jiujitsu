import { useEffect, useState } from "react";
import { MessageCircle, Package } from "lucide-react";
import { Browser } from "@capacitor/browser";
import { AppLauncher } from "@capacitor/app-launcher";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import { listarProdutos } from "../../services/produtoService";

function normalizarWhatsAppUrl(linkWhatsapp) {
  const valor = (linkWhatsapp || "").trim();

  if (!valor) {
    return {
      webUrl: "https://wa.me/",
      appUrl: "https://wa.me/",
    };
  }

  if (valor.startsWith("http://") || valor.startsWith("https://")) {
    return {
      webUrl: valor,
      appUrl: valor,
    };
  }

  let numero = valor.replace(/\D/g, "");

  if (numero.startsWith("55")) {
    return {
      webUrl: `https://wa.me/${numero}`,
      appUrl: `https://wa.me/${numero}`,
    };
  }

  if (numero.length === 10 || numero.length === 11) {
    numero = `55${numero}`;
  }

  return {
    webUrl: `https://wa.me/${numero}`,
    appUrl: `https://wa.me/${numero}`,
  };
}

export default function LojaScreen({ goTo }) {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setErro("");
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setErro("Erro ao carregar produtos.");
    }
  }

  async function abrirWhatsApp(linkWhatsapp, produtoNome) {
    try {
      const { webUrl, appUrl } = normalizarWhatsAppUrl(linkWhatsapp);

      const mensagem = `Olá, tenho interesse no produto: ${produtoNome}`;
      const mensagemCodificada = encodeURIComponent(mensagem);
      const urlComMensagem = `${webUrl}?text=${mensagemCodificada}`;
      const appUrlComMensagem = `${appUrl}?text=${mensagemCodificada}`;

      const resultado = await AppLauncher.canOpenUrl({ url: appUrl });

      if (resultado.value) {
        await AppLauncher.openUrl({ url: appUrlComMensagem });
        return;
      }

      await Browser.open({ url: urlComMensagem });
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);

      try {
        const { webUrl } = normalizarWhatsAppUrl(linkWhatsapp);
        const mensagem = `Olá, tenho interesse no produto: ${produtoNome}`;
        const mensagemCodificada = encodeURIComponent(mensagem);
        await Browser.open({ url: `${webUrl}?text=${mensagemCodificada}` });
      } catch (erroFallback) {
        console.error("Erro no fallback do WhatsApp:", erroFallback);
      }
    }
  }

  return (
    <PhoneFrame title="Loja" showBack onBack={() => goTo("home")}>
      <div className="p-4 space-y-4">
        {erro ? (
          <Card>
            <CardContent className="p-4 text-sm text-red-600">
              {erro}
            </CardContent>
          </Card>
        ) : null}

        {produtos.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-zinc-500">
              Nenhum produto cadastrado no momento.
            </CardContent>
          </Card>
        ) : (
          produtos.map((produto) => (
            <Card key={produto.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-40 bg-zinc-100 flex items-center justify-center text-white overflow-hidden">
                  {produto.imagemUrl ? (
                    <img
                      src={produto.imagemUrl}
                      alt={produto.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-red-700 via-red-600 to-black flex items-center justify-center">
                      <Package className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{produto.nome}</div>
                      <div className="text-sm text-zinc-500 mt-1">
                        {produto.estoque || "Disponível"}
                      </div>
                    </div>

                    {produto.destaque ? <Badge>Destaque</Badge> : null}
                  </div>

                  <div className="font-bold mt-3">{produto.preco}</div>

                  <Button
                    className="mt-3 w-full"
                    onClick={() =>
                      abrirWhatsApp(produto.linkWhatsapp, produto.nome)
                    }
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Pedir no WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <BottomNav current="loja" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}