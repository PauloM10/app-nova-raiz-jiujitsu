import { useEffect, useState } from "react";
import { CheckCircle2, History, ChevronDown, ChevronUp } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import {
  buscarChamadaDoAlunoHoje,
  formatarDataBR,
  listarHistoricoChamadasDoAluno,
} from "../../services/chamadaService";

export default function ChamadaScreen({ goTo, usuario }) {
  const [chamadaHoje, setChamadaHoje] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  useEffect(() => {
    carregarChamada();
  }, [usuario]);

  async function carregarChamada() {
    try {
      setCarregando(true);
      setErro("");

      const [dadosHoje, dadosHistorico] = await Promise.all([
        buscarChamadaDoAlunoHoje(usuario?.email),
        listarHistoricoChamadasDoAluno(usuario?.email),
      ]);

      setChamadaHoje(dadosHoje);
      setHistorico(dadosHistorico);
    } catch (error) {
      console.error("Erro ao carregar chamada do aluno:", error);
      setErro("Erro ao carregar sua chamada.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <PhoneFrame title="Minha Chamada" showBack onBack={() => goTo("perfil")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-red-600" />
              Presença e feedback individual
            </div>

            <p className="text-sm text-zinc-600 mt-2">
              Aqui você acompanha sua presença do dia e o histórico das chamadas.
            </p>
          </CardContent>
        </Card>

        {carregando ? (
          <Card>
            <CardContent className="p-4 text-sm text-zinc-500">
              Carregando sua chamada...
            </CardContent>
          </Card>
        ) : erro ? (
          <Card>
            <CardContent className="p-4 text-sm text-red-600">{erro}</CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Chamada de hoje</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {chamadaHoje?.data
                        ? formatarDataBR(chamadaHoje.data)
                        : formatarDataBR(new Date().toISOString().split("T")[0])}
                    </div>
                  </div>

                  {chamadaHoje?.status ? (
                    <Badge
                      className={
                        chamadaHoje.status === "Presente"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                      variant="secondary"
                    >
                      {chamadaHoje.status}
                    </Badge>
                  ) : null}
                </div>

                {!chamadaHoje ? (
                  <div className="text-sm text-zinc-500">
                    Sua chamada ainda não foi lançada hoje.
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-zinc-600">
                      Observação privada do professor:
                    </div>

                    <div className="rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700">
                      {chamadaHoje.observacao || "Sem observações para hoje."}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setMostrarHistorico(!mostrarHistorico)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="font-semibold flex items-center gap-2">
                    <History className="h-5 w-5 text-red-600" />
                    Histórico de chamadas
                  </div>

                  {mostrarHistorico ? (
                    <ChevronUp className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-zinc-500" />
                  )}
                </button>

                {mostrarHistorico ? (
                  historico.length === 0 ? (
                    <div className="text-sm text-zinc-500">
                      Nenhum histórico encontrado.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {historico.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl bg-zinc-100 p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-medium">
                              {formatarDataBR(item.data)}
                            </div>

                            <Badge
                              className={
                                item.status === "Presente"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                              variant="secondary"
                            >
                              {item.status}
                            </Badge>
                          </div>

                          <div className="text-sm text-zinc-700">
                            {item.observacao || "Sem observações."}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : null}
              </CardContent>
            </Card>
          </>
        )}

        <BottomNav current="perfil" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}