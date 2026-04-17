import { useEffect, useState } from "react";
import { BookOpen, Download } from "lucide-react";
import { Browser } from "@capacitor/browser";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { buscarSobreAcademia } from "../../services/sobreService";

export default function SobreScreen({ goTo }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const resultado = await buscarSobreAcademia();
      setDados(resultado);
    } catch (error) {
      console.error("Erro ao carregar sobre a academia:", error);
      setErro("Erro ao carregar informações da academia.");
    }
  }

  async function handleBaixarPdf() {
    try {
      if (!dados?.pdfUrl) return;

      let url = dados.pdfUrl.trim();

      if (url.startsWith("/")) {
        url = `${window.location.origin}${url}`;
      }

      await Browser.open({ url });
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
    }
  }

  return (
    <PhoneFrame title="Sobre a Academia" showBack onBack={() => goTo("perfil")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-red-600" />
              {dados?.titulo || "Sobre a academia"}
            </div>

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : (
              <div className="text-sm text-zinc-700 whitespace-pre-line">
                {dados?.texto || "Nenhuma informação cadastrada ainda."}
              </div>
            )}

            <Button className="w-full" onClick={handleBaixarPdf}>
              <Download className="h-4 w-4 mr-2" />
              {dados?.pdfTitulo || "Baixar e-book da academia"}
            </Button>
          </CardContent>
        </Card>

        <BottomNav current="perfil" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}