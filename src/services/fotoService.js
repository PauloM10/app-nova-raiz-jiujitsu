const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const STORAGE_KEY = "nova_raiz_fotos";

function validarConfiguracaoCloudinary() {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary não configurado. Verifique VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET no arquivo .env"
    );
  }
}

function lerFotosSalvas() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error("Erro ao ler fotos salvas:", error);
    return [];
  }
}

function salvarFotos(fotos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fotos));
}

export async function cadastrarFoto({ arquivo, titulo, categoria }) {
  validarConfiguracaoCloudinary();

  if (!arquivo) {
    throw new Error("Nenhum arquivo foi enviado.");
  }

  const formData = new FormData();
  formData.append("file", arquivo);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "nova-raiz/fotos");

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro Cloudinary:", data);
    throw new Error(
      data?.error?.message || "Erro ao enviar imagem para o Cloudinary."
    );
  }

  const novaFoto = {
    id: crypto.randomUUID(),
    titulo,
    categoria,
    url: data.secure_url,
    publicId: data.public_id,
    createdAt: new Date().toISOString(),
  };

  const fotosAtuais = lerFotosSalvas();
  const novasFotos = [novaFoto, ...fotosAtuais];

  salvarFotos(novasFotos);

  return novaFoto;
}

export async function listarFotos() {
  return lerFotosSalvas();
}

export async function excluirFoto(id) {
  const fotosAtuais = lerFotosSalvas();
  const novasFotos = fotosAtuais.filter((foto) => foto.id !== id);

  salvarFotos(novasFotos);
}