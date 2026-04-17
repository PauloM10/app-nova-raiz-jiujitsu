import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Image as ImageIcon,
  Trophy,
  ClipboardCheck,
  Bell,
  ChevronRight,
  PlayCircle,
  Package,
} from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import NovaRaizLogo from "../../components/layout/NovaRaizLogo";
import Badge from "../../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { buscarAvisoDestaque } from "../../services/avisoService";
import { buscarProdutoDestaque } from "../../services/produtoService";

export default function HomeAluno({ goTo }) {
  const [avisoDestaque, setAvisoDestaque] = useState(null);
  const [produtoDestaque, setProdutoDestaque] = useState(null);

  useEffect(() => {
    carregarDadosDestaque();
  }, []);

  async function carregarDadosDestaque() {
    try {
      const [aviso, produto] = await Promise.all([
        buscarAvisoDestaque(),
        buscarProdutoDestaque(),
      ]);

      setAvisoDestaque(aviso);
      setProdutoDestaque(produto);
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
    }
  }

  return (
    <PhoneFrame title="Home">
      <div className="p-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-3xl border-0 shadow-[0_16px_40px_rgba(220,38,38,0.28)] overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-black text-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <NovaRaizLogo size="small" />
                <div>
                  <Badge className="bg-white/20 text-white border-0 mb-2">
                    Bem-vindo
                  </Badge>
                  <h2 className="text-xl font-bold">Portal do Aluno</h2>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-red-50 mt-2">
                    Treinos, avisos, acompanhamento individual e produtos da
                    academia em um só lugar.
                  </p>
                </div>

                <Trophy className="h-8 w-8 text-red-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer" onClick={() => goTo("agenda")}>
            <CardContent className="p-4">
              <CalendarDays className="h-5 w-5 mb-2 text-red-600" />
              <div className="font-semibold">Próximos treinos</div>
              <div className="text-sm text-zinc-500">Veja dias e horários</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer" onClick={() => goTo("fotos")}>
            <CardContent className="p-4">
              <ImageIcon className="h-5 w-5 mb-2 text-red-600" />
              <div className="font-semibold">Fotos</div>
              <div className="text-sm text-zinc-500">Galeria da academia</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer" onClick={() => goTo("chamada")}>
            <CardContent className="p-4">
              <ClipboardCheck className="h-5 w-5 mb-2 text-red-600" />
              <div className="font-semibold">Minha chamada</div>
              <div className="text-sm text-zinc-500">Presença e observações</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer" onClick={() => goTo("videos")}>
            <CardContent className="p-4">
              <PlayCircle className="h-5 w-5 mb-2 text-red-600" />
              <div className="font-semibold">Vídeos</div>
              <div className="text-sm text-zinc-500">Aulas e conteúdos</div>
            </CardContent>
          </Card>
        </div>

        <Card className="cursor-pointer" onClick={() => goTo("avisos")}>
          <CardHeader className="pb-2">
            <CardTitle>Avisos</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bell className="h-4 w-4 text-red-600" />
                {avisoDestaque?.titulo || "Nenhum aviso em destaque"}
              </div>

              <p className="text-sm text-zinc-600 mt-2">
                {avisoDestaque?.texto || "Ainda não existe aviso em destaque cadastrado."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer overflow-hidden" onClick={() => goTo("loja")}>
          <CardHeader className="pb-2">
            <CardTitle>Produto em destaque</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-2xl bg-zinc-100 overflow-hidden">
              <div className="h-36 bg-zinc-200 flex items-center justify-center overflow-hidden">
                {produtoDestaque?.imagemUrl ? (
                  <img
                    src={produtoDestaque.imagemUrl}
                    alt={produtoDestaque.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-red-700 via-red-600 to-black flex items-center justify-center text-white">
                    <Package className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {produtoDestaque?.nome || "Nenhum produto em destaque"}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {produtoDestaque?.preco || "Cadastre um produto e marque como destaque."}
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-zinc-500 shrink-0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <BottomNav current="home" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}