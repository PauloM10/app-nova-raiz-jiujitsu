import { useEffect, useState } from "react";

import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import EsqueciSenhaScreen from "./pages/EsqueciSenhaScreen";
import AppBloqueadoScreen from "./pages/AppBloqueadoScreen";

import HomeAluno from "./pages/aluno/HomeAluno";
import AgendaScreen from "./pages/aluno/AgendaScreen";
import FotosScreen from "./pages/aluno/FotosScreen";
import LojaScreen from "./pages/aluno/LojaScreen";
import ChamadaScreen from "./pages/aluno/ChamadaScreen";
import PerfilAlunoScreen from "./pages/aluno/PerfilAlunoScreen";
import VideosScreen from "./pages/aluno/VideosScreen";
import SobreScreen from "./pages/aluno/SobreScreen";
import AvisosScreen from "./pages/aluno/AvisosScreen";

import AdminDashboardScreen from "./pages/admin/AdminDashboardScreen";
import AdminAlunosScreen from "./pages/admin/AdminAlunosScreen";
import AdminProfessoresScreen from "./pages/admin/AdminProfessoresScreen";
import AdminCadastroAlunoScreen from "./pages/admin/AdminCadastroAlunoScreen";
import AdminCadastroProfessorScreen from "./pages/admin/AdminCadastroProfessorScreen";
import AdminTreinosScreen from "./pages/admin/AdminTreinosScreen";
import AdminChamadaScreen from "./pages/admin/AdminChamadaScreen";
import AdminFotosScreen from "./pages/admin/AdminFotosScreen";
import AdminLojaScreen from "./pages/admin/AdminLojaScreen";
import AdminLojaSenhaScreen from "./pages/admin/AdminLojaSenhaScreen";
import AdminAvisosScreen from "./pages/admin/AdminAvisosScreen";
import AdminVideosScreen from "./pages/admin/AdminVideosScreen";
import AdminSobreScreen from "./pages/admin/AdminSobreScreen";

import { observarAuth } from "./services/authService";
import { buscarUsuarioPorUid } from "./services/userService";
import { buscarConfigApp } from "./services/appConfigService";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [carregandoAuth, setCarregandoAuth] = useState(true);
  const [logged, setLogged] = useState(false);
  const [perfil, setPerfil] = useState("aluno");
  const [screen, setScreen] = useState("login");
  const [usuario, setUsuario] = useState(null);

  const [appAtivo, setAppAtivo] = useState(true);
  const [mensagemBloqueio, setMensagemBloqueio] = useState(
    "Aplicativo temporariamente indisponível. Tente novamente mais tarde."
  );

  const [lojaLiberada, setLojaLiberada] = useState(false);

  useEffect(() => {
    async function carregarConfig() {
      const config = await buscarConfigApp();
      setAppAtivo(config.appAtivo);
      setMensagemBloqueio(config.mensagem);
    }

    carregarConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = observarAuth(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const dadosUsuario = await buscarUsuarioPorUid(firebaseUser.uid);

          const usuarioCompleto = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            perfil: dadosUsuario.perfil,
            nome: dadosUsuario.nome || "",
          };

          setUsuario(usuarioCompleto);
          setPerfil(usuarioCompleto.perfil);
          setLogged(true);
          setScreen(usuarioCompleto.perfil === "professor" ? "admin_home" : "home");
        } else {
          setUsuario(null);
          setLogged(false);
          setPerfil("aluno");
          setScreen("login");
          setLojaLiberada(false);
        }
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
        setUsuario(null);
        setLogged(false);
        setPerfil("aluno");
        setScreen("login");
        setLojaLiberada(false);
      } finally {
        setCarregandoAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (carregandoAuth) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600 text-sm">Carregando sessão...</div>
      </div>
    );
  }

  if (!appAtivo) {
    return <AppBloqueadoScreen mensagem={mensagemBloqueio} />;
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      {!logged ? (
        screen === "esqueci_senha" ? (
          <EsqueciSenhaScreen goTo={setScreen} />
        ) : (
          <LoginScreen
            onEnter={(user) => {
              setUsuario(user);
              setPerfil(user.perfil);
              setLogged(true);
              setScreen(user.perfil === "professor" ? "admin_home" : "home");
              setLojaLiberada(false);
            }}
            perfil={perfil}
            setPerfil={setPerfil}
            goTo={setScreen}
          />
        )
      ) : perfil === "professor" && screen.startsWith("admin") ? (
        screen === "admin_home" ? (
          <AdminDashboardScreen
            goTo={setScreen}
            usuario={usuario}
            abrirAreaAluno={() => setScreen("home")}
          />
        ) : screen === "admin_alunos" ? (
          <AdminAlunosScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_professores" ? (
          <AdminProfessoresScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_cadastro" ? (
          <AdminCadastroAlunoScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_cadastro_professor" ? (
          <AdminCadastroProfessorScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_treinos" ? (
          <AdminTreinosScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_chamada" ? (
          <AdminChamadaScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_loja_senha" ? (
          lojaLiberada ? (
            <AdminLojaScreen goTo={setScreen} usuario={usuario} />
          ) : (
            <AdminLojaSenhaScreen
              goTo={setScreen}
              liberarLoja={() => {
                setLojaLiberada(true);
                setScreen("admin_loja");
              }}
            />
          )
        ) : screen === "admin_loja" ? (
          lojaLiberada ? (
            <AdminLojaScreen goTo={setScreen} usuario={usuario} />
          ) : (
            <AdminLojaSenhaScreen
              goTo={setScreen}
              liberarLoja={() => {
                setLojaLiberada(true);
                setScreen("admin_loja");
              }}
            />
          )
        ) : screen === "admin_fotos" ? (
          <AdminFotosScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_avisos" ? (
          <AdminAvisosScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_videos" ? (
          <AdminVideosScreen goTo={setScreen} usuario={usuario} />
        ) : screen === "admin_sobre" ? (
          <AdminSobreScreen goTo={setScreen} usuario={usuario} />
        ) : (
          <AdminDashboardScreen
            goTo={setScreen}
            usuario={usuario}
            abrirAreaAluno={() => setScreen("home")}
          />
        )
      ) : screen === "home" ? (
        <HomeAluno goTo={setScreen} usuario={usuario} />
      ) : screen === "agenda" ? (
        <AgendaScreen goTo={setScreen} usuario={usuario} />
      ) : screen === "videos" ? (
        <VideosScreen goTo={setScreen} usuario={usuario} />
      ) : screen === "fotos" ? (
        <FotosScreen goTo={setScreen} usuario={usuario} />
      ) : screen === "loja" ? (
        <LojaScreen goTo={setScreen} usuario={usuario} />
      ) : screen === "chamada" ? (
        <ChamadaScreen goTo={setScreen} usuario={usuario} />
      ) : screen === "sobre" ? (
        <SobreScreen goTo={setScreen} usuario={usuario} />
      ) : screen === "avisos" ? (
        <AvisosScreen goTo={setScreen} usuario={usuario} />
      ) : screen === "perfil" ? (
        <PerfilAlunoScreen
          goTo={setScreen}
          usuario={usuario}
          voltarProfessor={() => setScreen("admin_home")}
        />
      ) : (
        <HomeAluno goTo={setScreen} usuario={usuario} />
      )}
    </div>
  );
}