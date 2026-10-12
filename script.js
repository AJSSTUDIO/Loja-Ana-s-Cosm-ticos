// Abrir/Fechar Menu Mobile
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Fechar menu ao clicar em algum link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// -------------------------------------------------------------
// DADOS PADRÃO DE PRODUTOS / SERVIÇOS
// -------------------------------------------------------------
const produtosPadrao = [
  {
    id: 1,
    titulo: "Maquiagem",
    desc: "Batons, bases, paletas de sombras e muito mais para compor seu look perfeito.",
    icone: "fa-solid fa-sparkles"
  },
  {
    id: 2,
    titulo: "Skincare",
    desc: "Séruns, hidratantes e sabonetes faciais para manter sua pele impecável.",
    icone: "fa-solid fa-pump-soap"
  },
  {
    id: 3,
    titulo: "Cabelos & Tranças",
    desc: "Tratamentos, produtos específicos para tranças e finalizadores de alto desempenho.",
    icone: "fa-solid fa-wand-magic-sparkles"
  },
  {
    id: 4,
    titulo: "Perfumaria",
    desc: "Fragrâncias marcantes e envolventes para todas as ocasiões.",
    icone: "fa-solid fa-spray-can"
  }
];

// -------------------------------------------------------------
// SISTEMA ADMINISTRATIVO (PROPRIETÁRIO)
// -------------------------------------------------------------
const CHAVE_DE_ACESSO = "36596018";

const btnAbrirAdmin = document.getElementById('btnAbrirAdmin');
const adminModal = document.getElementById('adminModal');
const closeAdmin = document.getElementById('closeAdmin');
const inputPromoImg = document.getElementById('inputPromoImg');
const btnSalvarPromo = document.getElementById('btnSalvarPromo');
const imgPromocao = document.getElementById('imgPromocao');
const formNovoProduto = document.getElementById('formNovoProduto');
const gridProdutos = document.getElementById('gridProdutos');

// Ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const imagemSalva = localStorage.getItem('banner_promocao');
  if (imagemSalva && imgPromocao) {
    imgPromocao.src = imagemSalva;
  }
  carregarProdutos();
  carregarComentarios();
});

// Ação do Botão "Área do Proprietário"
if (btnAbrirAdmin) {
  btnAbrirAdmin.addEventListener('click', (e) => {
    e.preventDefault();

    if (sessionStorage.getItem('admin_logado') === 'true') {
      if (adminModal) adminModal.style.display = "flex";
      carregarProdutos();
      carregarComentarios();
      return;
    }

    const senhaDigitada = prompt("Por favor, informe a Chave de Acesso do Proprietário:");

    if (senhaDigitada === CHAVE_DE_ACESSO) {
      sessionStorage.setItem('admin_logado', 'true');
      if (adminModal) adminModal.style.display = "flex";
      carregarProdutos();
      carregarComentarios();
      alert("Acesso autorizado! O modo administrador está ativo.");
    } else if (senhaDigitada !== null) {
      alert("Chave de Acesso incorreta! Acesso negado.");
    }
  });
}

if (closeAdmin) {
  closeAdmin.addEventListener('click', () => {
    if (adminModal) adminModal.style.display = "none";
  });
}

// Atualizar Imagem da Promoção
if (btnSalvarPromo) {
  btnSalvarPromo.addEventListener('click', () => {
    const file = inputPromoImg.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64Image = e.target.result;
        localStorage.setItem('banner_promocao', base64Image);
        if (imgPromocao) imgPromocao.src = base64Image;
        alert("Promoção atualizada com sucesso!");
        if (adminModal) adminModal.style.display = "none";
        inputPromoImg.value = "";
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecione um arquivo de imagem.");
    }
  });
}

// Cadastrar Novo Produto / Serviço Destaque
if (formNovoProduto) {
  formNovoProduto.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('tituloProd').value.trim();
    const desc = document.getElementById('descProd').value.trim();
    const icone = document.getElementById('iconeProd').value;

    const novoProd = { id: Date.now(), titulo, desc, icone };

    let produtos = JSON.parse(localStorage.getItem('lista_produtos')) || produtosPadrao;
    produtos.push(novoProd);

    localStorage.setItem('lista_produtos', JSON.stringify(produtos));

    carregarProdutos();
    formNovoProduto.reset();
    alert("Novo destaque adicionado com sucesso!");
  });
}

// Apagar Produto / Serviço
function apagarProduto(id) {
  if (confirm("Deseja apagar este card de destaque do site?")) {
    let produtos = JSON.parse(localStorage.getItem('lista_produtos')) || produtosPadrao;
    produtos = produtos.filter(p => p.id !== id);

    localStorage.setItem('lista_produtos', JSON.stringify(produtos));
    carregarProdutos();
    alert("Destaque removido com sucesso!");
  }
}

// Carregar Produtos na Tela
function carregarProdutos() {
  if (!gridProdutos) return;

  let produtos = JSON.parse(localStorage.getItem('lista_produtos')) || produtosPadrao;
  const isAdminAutenticado = sessionStorage.getItem('admin_logado') === 'true';

  gridProdutos.innerHTML = "";

  produtos.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('card');

    const btnApagarHTML = isAdminAutenticado ? `
      <button onclick="apagarProduto(${p.id})" class="btn-apagar-produto" title="Remover Destaque">
        <i class="fa-solid fa-trash-can"></i> Apagar
      </button>
    ` : '';

    card.innerHTML = `
      <div>
        <i class="${p.icone} icon"></i>
        <h3>${p.titulo}</h3>
        <p>${p.desc}</p>
      </div>
      ${btnApagarHTML}
    `;

    gridProdutos.appendChild(card);
  });
}

// -------------------------------------------------------------
// SISTEMA DE AVALIAÇÕES / COMENTÁRIOS DOS CLIENTES
// -------------------------------------------------------------
const btnAbrirForm = document.getElementById('btnAbrirForm');
const formModal = document.getElementById('formModal');
const closeForm = document.getElementById('closeForm');
const formAvaliacao = document.getElementById('formAvaliacao');
const gridDepoimentos = document.getElementById('gridDepoimentos');

if (btnAbrirForm) {
  btnAbrirForm.addEventListener('click', () => {
    if (formModal) formModal.style.display = "flex";
  });
}

if (closeForm) {
  closeForm.addEventListener('click', () => {
    if (formModal) formModal.style.display = "none";
  });
}

window.addEventListener('click', (e) => {
  if (adminModal && e.target === adminModal) adminModal.style.display = "none";
  if (formModal && e.target === formModal) formModal.style.display = "none";
});

if (formAvaliacao) {
  formAvaliacao.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeCliente').value.trim();
    const texto = document.getElementById('textoCliente').value.trim();
    const inicial = nome.charAt(0).toUpperCase();

    const novoComentario = { id: Date.now(), nome, texto, inicial };

    let comentarios = JSON.parse(localStorage.getItem('lista_comentarios')) || [];
    comentarios.unshift(novoComentario);

    localStorage.setItem('lista_comentarios', JSON.stringify(comentarios));

    carregarComentarios();

    formAvaliacao.reset();
    if (formModal) formModal.style.display = "none";
    alert("Obrigado pela sua avaliação! Ela já foi publicada no site.");
  });
}

function apagarComentario(id) {
  if (confirm("Tem certeza de que deseja apagar esta avaliação permanentemente?")) {
    let comentarios = JSON.parse(localStorage.getItem('lista_comentarios')) || [];
    comentarios = comentarios.filter(item => item.id !== id);

    localStorage.setItem('lista_comentarios', JSON.stringify(comentarios));
    carregarComentarios();
    alert("Comentário apagado com sucesso.");
  }
}

function carregarComentarios() {
  if (!gridDepoimentos) return;

  let comentarios = JSON.parse(localStorage.getItem('lista_comentarios')) || [];
  const isAdminAutenticado = sessionStorage.getItem('admin_logado') === 'true';

  gridDepoimentos.innerHTML = "";

  if (comentarios.length === 0) {
    gridDepoimentos.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #888;">Seja a primeira pessoa a deixar uma avaliação sobre a Ana's Cosméticos!</p>`;
    return;
  }

  comentarios.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card-depoimento');

    const btnApagarHTML = isAdminAutenticado ? `
      <button onclick="apagarComentario(${item.id})" class="btn-apagar-comentario" title="Apagar Comentário">
        <i class="fa-solid fa-trash-can"></i> Apagar
      </button>
    ` : '';

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          ${btnApagarHTML}
        </div>
        <p class="texto-depoimento">"${item.texto}"</p>
      </div>
      <div class="autor-depoimento">
        <div class="avatar-autor">${item.inicial}</div>
        <div>
          <h4>${item.nome}</h4>
          <span>Cliente Verificado</span>
        </div>
      </div>
    `;
    gridDepoimentos.appendChild(card);
  });
}