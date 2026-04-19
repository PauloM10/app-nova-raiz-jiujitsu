import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

const SENHA_LOJA = "1234";

export default function AdminLojaSenhaScreen({
  goTo,
  liberarLoja,
}) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleEntrar() {
    setErro("");

    if (!senha.trim()) {
      setErro("Digite a senha da loja.");
      return;
    }

    if (senha !== SENHA_LOJA) {
      setErro("Senha incorreta.");
      return;
    }

    liberarLoja();
  }

  return (
    <PhoneFrame title="Acesso à Loja" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-red-600" />
              Área protegida da loja
            </div>

            <div className="text-sm text-zinc-600">
              Digite a senha para acessar o gerenciamento da loja.
            </div>

            <Input
              placeholder="Senha da loja"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button className="w-full h-11" onClick={handleEntrar}>
              Entrar na loja
            </Button>
          </CardContent>
        </Card>
      </div>
    </PhoneFrame>
  );
}