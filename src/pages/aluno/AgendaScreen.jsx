import { useEffect, useMemo, useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import { listarTreinos } from "../../services/treinoService";

export default function AgendaScreen({ goTo }) {
  const [busca, setBusca] = useState("");
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarTreinos() {
      try {
        const dados = await listarTreinos();
        setTreinos(dados);
      } catch (error) {
        console.error("Erro ao listar treinos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarTreinos();
  }, []);

  const treinosFiltrados = treinos.filter((treino) => {
    const termo = busca.toLowerCase();
    return (
      treino.titulo?.toLowerCase().includes(termo) ||
      treino.descricao?.toLowerCase().includes(termo) ||
      treino.turma?.toLowerCase().includes(termo) ||
      treino.data?.toLowerCase().includes(termo)
    );
  });

  const hojeIso = new Date().toISOString().split("T")[0];

  const { treinosHoje, proximosTreinos } = useMemo(() => {
    const hoje = [];
    const proximos = [];

    treinosFiltrados.forEach((treino) => {
      if (treino.data === hojeIso) {
        hoje.push(treino);
      } else {
        proximos.push(treino);
      }
    });

    return {
      treinosHoje: hoje,
      proximosTreinos: proximos,
    };
  }, [treinosFiltrados, hojeIso]);

  const renderTreinoCard = (treino) => (
    <Card key={treino.id}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{treino.titulo}</div>
          <Badge variant="secondary">{treino.turma}</Badge>
        </div>

        <div className="text-sm text-zinc-600">
          {treino.descricao}
        </div>

        <div className="text-sm text-zinc-600 flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-red-600" />
          {treino.horario}
        </div>

        <div className="text-sm text-zinc-600 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-red-600" />
          {treino.data}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PhoneFrame title="Agenda de Treinos" showBack onBack={() => goTo("home")}>
      <div className="p-4 space-y-4">
        <Input
          placeholder="Buscar treino"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {loading ? (
          <div className="text-sm text-zinc-500">Carregando treinos...</div>
        ) : treinosFiltrados.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhum treino encontrado.</div>
        ) : (
          <>
            {treinosHoje.length > 0 ? (
              <div className="space-y-3">
                <div className="font-semibold text-red-600">Hoje</div>
                {treinosHoje.map(renderTreinoCard)}
              </div>
            ) : null}

            {proximosTreinos.length > 0 ? (
              <div className="space-y-3">
                <div className="font-semibold text-zinc-700">Próximos</div>
                {proximosTreinos.map(renderTreinoCard)}
              </div>
            ) : null}
          </>
        )}

        <BottomNav current="agenda" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}