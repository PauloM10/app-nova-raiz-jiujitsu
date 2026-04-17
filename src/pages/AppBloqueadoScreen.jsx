import PhoneFrame from "../components/layout/PhoneFrame";
import { Card, CardContent } from "../components/ui/Card";
import NovaRaizLogo from "../components/layout/NovaRaizLogo";

export default function AppBloqueadoScreen({ mensagem }) {
  return (
    <PhoneFrame title="Nova Raiz Jiu-jitsu">
      <div className="p-6">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <NovaRaizLogo size="large" />
            </div>

            <div className="text-xl font-bold text-zinc-800">
              Aplicativo indisponível
            </div>

            <div className="text-sm text-zinc-600">
              {mensagem || "Aplicativo temporariamente indisponível. Tente novamente mais tarde."}
            </div>
          </CardContent>
        </Card>
      </div>
    </PhoneFrame>
  );
}