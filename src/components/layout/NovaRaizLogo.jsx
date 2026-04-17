import { useState } from "react";
import { LOGO_URL } from "../../data/mockData";

export default function NovaRaizLogo({ size = "large" }) {
  const [erroImagem, setErroImagem] = useState(false);
  const wrapper = size === "small" ? "h-14 w-14" : "h-24 w-24";

  if (erroImagem) {
    return (
      <div className={`${wrapper} rounded-full bg-white shadow-[0_10px_30px_rgba(220,38,38,0.35)] flex items-center justify-center overflow-hidden border-4 border-white`}>
        <div className="h-full w-full rounded-full bg-gradient-to-br from-red-700 via-red-600 to-black text-white flex flex-col items-center justify-center leading-none">
          <div className="text-[8px] font-semibold tracking-[0.28em] opacity-90">NOVA</div>
          <div className="text-base font-black italic -mt-0.5">RAIZ</div>
          <div className="text-[7px] font-medium tracking-[0.16em] mt-0.5 opacity-90">JIU-JITSU</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${wrapper} rounded-full bg-white shadow-[0_10px_30px_rgba(220,38,38,0.35)] flex items-center justify-center overflow-hidden border-4 border-white`}>
      <img
        src={LOGO_URL}
        alt="Logo Nova Raiz Jiu-jitsu"
        className="h-full w-full object-cover"
        onError={() => setErroImagem(true)}
      />
    </div>
  );
}