import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import { listarAvisos } from "../../services/avisoService";

export default function AvisosScreen({ goTo }) {
  const [avisos, setAvisos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarAvisos();
  }, []);

  async function carregarAvisos() {
    try {
      setErro("");
      const dados = await listarAvisos();
      setAvisos(dados);
    } catch (error) {
      console.error("Erro ao carregar avisos:", error);
      setErro("Erro ao carregar avisos.");
    }
  }

  return (
    <PhoneFrame title="Avisos" showBack onBack={() => goTo("home")}>
      <div className="p-4 space-y-4">
        {erro ? (
          <Card>
            <CardContent className="p-4 text-sm text-red-600">
              {erro}
            </CardContent>
          </Card>
        ) : null}

        {avisos.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-zinc-500">
              Nenhum aviso cadastrado no momento.
            </CardContent>
          </Card>
        ) : (
          avisos.map((aviso) => (
            <Card key={aviso.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-full">
                    <div className="flex items-center gap-2 font-semibold">
                      <Bell className="h-4 w-4 text-red-600" />
                      {aviso.titulo}
                    </div>

                    <div className="text-sm text-zinc-600 mt-2 whitespace-pre-line">
                      {aviso.texto}
                    </div>
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

        <BottomNav current="home" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}