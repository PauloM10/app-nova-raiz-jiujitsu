import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";
import { Browser } from "@capacitor/browser";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { listarVideos, buscarCategoriasVideos } from "../../services/videoService";

export default function VideosScreen({ goTo }) {
  const [videos, setVideos] = useState([]);
  const [categorias, setCategorias] = useState([
    "Categoria 1",
    "Categoria 2",
    "Categoria 3",
    "Categoria 4",
    "Categoria 5",
  ]);
  const [abaAtiva, setAbaAtiva] = useState("");

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    try {
      const [dadosVideos, dadosCategorias] = await Promise.all([
        listarVideos(),
        buscarCategoriasVideos(),
      ]);

      setVideos(dadosVideos);
      setCategorias(dadosCategorias);
      setAbaAtiva(dadosCategorias[0] || "");
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    }
  }

  async function abrirVideo(link) {
    try {
      if (!link) return;
      await Browser.open({ url: link });
    } catch (error) {
      console.error("Erro ao abrir vídeo:", error);
    }
  }

  const videosFiltrados = useMemo(() => {
    return videos.filter((video) => video.categoria === abaAtiva);
  }, [videos, abaAtiva]);

  return (
    <PhoneFrame title="Vídeos" showBack onBack={() => goTo("home")}>
      <div className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setAbaAtiva(categoria)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                abaAtiva === categoria
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {videosFiltrados.length === 0 ? (
          <div className="text-sm text-zinc-500">
            Nenhum vídeo cadastrado nesta categoria.
          </div>
        ) : (
          videosFiltrados.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">{video.titulo}</div>

                {video.descricao ? (
                  <div className="text-sm text-zinc-600">
                    {video.descricao}
                  </div>
                ) : null}

                <Button
                  onClick={() => abrirVideo(video.link)}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Assistir vídeo
                </Button>
              </CardContent>
            </Card>
          ))
        )}

        <BottomNav current="home" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}