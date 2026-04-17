import { useEffect, useState } from "react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import { listarFotos } from "../../services/fotoService";

export default function FotosScreen({ goTo }) {
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarFotos() {
      try {
        const dados = await listarFotos();
        setFotos(dados);
      } catch (error) {
        console.error("Erro ao listar fotos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarFotos();
  }, []);

  return (
    <PhoneFrame title="Fotos" showBack onBack={() => goTo("home")}>
      <div className="p-4 space-y-4">
        <div className="flex gap-2 overflow-auto pb-1">
          {["Todos"].map((item) => (
            <Badge key={item} variant="secondary" className="whitespace-nowrap">
              {item}
            </Badge>
          ))}
        </div>

        {fotoSelecionada ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-60 bg-zinc-100">
                <img
                  src={fotoSelecionada.url}
                  alt={fotoSelecionada.titulo}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{fotoSelecionada.titulo}</div>
                    <div className="text-sm text-zinc-500 mt-1">
                      {fotoSelecionada.categoria}
                    </div>
                  </div>

                  <button
                    className="rounded-full px-3 py-1 text-xs bg-red-100 text-red-700"
                    onClick={() => setFotoSelecionada(null)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <div className="text-sm text-zinc-500">Carregando fotos...</div>
        ) : fotos.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhuma foto encontrada.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {fotos.map((foto) => (
              <button
                key={foto.id}
                className="text-left"
                onClick={() => setFotoSelecionada(foto)}
              >
                <div className="rounded-3xl overflow-hidden bg-white shadow-sm border border-zinc-100">
                  <div className="h-32 bg-zinc-100">
                    <img
                      src={foto.url}
                      alt={foto.titulo}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <div className="font-medium text-sm">{foto.titulo}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {foto.categoria}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <BottomNav current="fotos" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}