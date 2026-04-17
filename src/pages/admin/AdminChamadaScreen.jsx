import { useEffect, useState } from "react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import { Card, CardContent } from "../../components/ui/Card";
import { listarAlunos } from "../../services/alunoService";
import {
  formatarDataBR,
  listarChamadasHoje,
  salvarChamada,
} from "../../services/chamadaService";

export default function AdminChamadaScreen({ goTo }) {
  const [alunos, setAlunos] = useState([]);
  const [chamadasMap, setChamadasMap] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [salvandoId, setSalvandoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const dataHojeIso = new Date().toISOString().split("T")[0];
  const dataHojeFormatada = formatarDataBR(dataHojeIso);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [listaAlunos, listaChamadas] = await Promise.all([
        listarAlunos(),
        listarChamadasHoje(),
      ]);

      const mapaChamadas = {};

      listaChamadas.forEach((item) => {
        mapaChamadas[item.alunoId] = {
          status: item.status || "",
          observacao: item.observacao || "",
        };
      });

      setAlunos(listaAlunos);
      setChamadasMap(mapaChamadas);
    } catch (error) {
      console.error("Erro ao carregar chamada:", error);
      setErro("Erro ao carregar chamada.");
    } finally {
      setCarregando(false);
    }
  }

  function alterarObservacao(alunoId, valor) {
    setChamadasMap((prev) => ({
      ...prev,
      [alunoId]: {
        status: prev[alunoId]?.status || "",
        observacao: valor,
      },
    }));
  }

  function marcarStatus(alunoId, status) {
    setChamadasMap((prev) => ({
      ...prev,
      [alunoId]: {
        status,
        observacao: prev[alunoId]?.observacao || "",
      },
    }));
  }

  async function salvarAluno(aluno) {
    try {
      setSalvandoId(aluno.id);
      setMensagem("");
      setErro("");

      const chamadaAtual = chamadasMap[aluno.id] || {};

      if (!chamadaAtual.status) {
        setErro(`Selecione Presente ou Falta para ${aluno.nome}.`);
        return;
      }

      await salvarChamada({
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        alunoEmail: aluno.email || "",
        status: chamadaAtual.status,
        observacao: chamadaAtual.observacao || "",
      });

      setMensagem(`Chamada salva para ${aluno.nome}.`);
    } catch (error) {
      console.error("Erro ao salvar chamada:", error);
      setErro("Erro ao salvar chamada.");
    } finally {
      setSalvandoId("");
    }
  }

  return (
    <PhoneFrame title="Chamada da Aula" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold">Chamada do dia</div>
            <div className="text-sm text-zinc-500 mt-1">{dataHojeFormatada}</div>
          </CardContent>
        </Card>

        {mensagem ? (
          <div className="text-sm text-green-600 font-medium">{mensagem}</div>
        ) : null}

        {erro ? (
          <div className="text-sm text-red-600 font-medium">{erro}</div>
        ) : null}

        {carregando ? (
          <div className="text-sm text-zinc-500">Carregando alunos...</div>
        ) : null}

        {!carregando &&
          alunos.map((aluno) => {
            const chamadaAtual = chamadasMap[aluno.id] || {};
            const statusAtual = chamadaAtual.status || "";
            const observacaoAtual = chamadaAtual.observacao || "";

            return (
              <Card key={aluno.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{aluno.nome}</div>
                      <div className="text-xs text-zinc-500">
                        {aluno.faixa || "Sem faixa"} • {aluno.turma || "Sem turma"}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => marcarStatus(aluno.id, "Presente")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          statusAtual === "Presente"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        Presente
                      </button>

                      <button
                        type="button"
                        onClick={() => marcarStatus(aluno.id, "Falta")}
                        className={`rounded-full px-3 py-1 text-xs ${
                          statusAtual === "Falta"
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        Falta
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={observacaoAtual}
                    onChange={(e) => alterarObservacao(aluno.id, e.target.value)}
                    placeholder="Observação privada do professor"
                    className="w-full rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700 outline-none min-h-[90px]"
                  />

                  <button
                    type="button"
                    onClick={() => salvarAluno(aluno)}
                    disabled={salvandoId === aluno.id}
                    className="w-full rounded-2xl bg-red-600 text-white py-2 text-sm font-medium disabled:opacity-60"
                  >
                    {salvandoId === aluno.id ? "Salvando..." : "Salvar chamada"}
                  </button>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </PhoneFrame>
  );
}