import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import NovaRaizLogo from "./NovaRaizLogo";

export default function PhoneFrame({
  title,
  children,
  showBack = false,
  onBack,
  hideHeader = false,
}) {
  const [horaAtual, setHoraAtual] = useState("");

  useEffect(() => {
    function atualizarHora() {
      const agora = new Date();
      const hora = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setHoraAtual(hora);
    }

    atualizarHora();

    const intervalo = setInterval(atualizarHora, 30000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="w-full min-h-[100dvh] bg-white overflow-hidden">
      {!hideHeader ? (
        <div className="sticky top-0 z-20 bg-gradient-to-r from-red-700 via-red-600 to-black text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="rounded-full p-1 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : null}
            <div className="text-sm font-medium">{title}</div>
          </div>

          <div className="flex items-center gap-2 text-xs text-red-100">
            <span>{horaAtual}</span>
            <span>●●●</span>
          </div>
        </div>
      ) : null}

      <div
        className={
          hideHeader
            ? "min-h-[100dvh] bg-zinc-50 relative"
            : "min-h-[calc(100dvh-52px)] bg-zinc-50 relative"
        }
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
          <div className="opacity-[1.00] scale-[2.8]">
            <NovaRaizLogo size="large" />
          </div>
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}