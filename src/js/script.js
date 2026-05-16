/*GRUPO FOCO — main.js Sprint 2 — Web Development*/

/*NAVBAR — scroll + hamburger*/
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

if (navbar) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
}

/*CONTADOR ANIMADO — hero stats (index.html)*/
function animateCounters() {
  var counters = document.querySelectorAll('.stat-num');
  counters.forEach(function (counter) {
    var target   = parseInt(counter.getAttribute('data-target'), 10);
    var duration = 1500;
    var step     = target / (duration / 16);
    var current  = 0;

    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

var heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(heroStats);
}

/*CARDS EXPANSÍVEIS — index.html Manipulação dinâmica de elementos do DOM*/
function expandCard(btn) {
  var card   = btn.closest('.card');
  var detail = card.querySelector('.card-detail');
  var isOpen = !detail.classList.contains('hidden');

  // Fecha todos os cards abertos
  document.querySelectorAll('.card-detail').forEach(function (d) {
    d.classList.add('hidden');
  });
  document.querySelectorAll('.card-btn').forEach(function (b) {
    b.textContent = 'Saiba mais';
  });

  // Abre o clicado (se estava fechado)
  if (!isOpen) {
    detail.classList.remove('hidden');
    btn.textContent = 'Fechar';
  }
}

/*ALERTAS E PROMPTS — index.html Requisito: alert(), prompt(), confirm()*/
var notes = [];

function showAlertOutput(msg, type) {
  var el = document.getElementById('alertOutput');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'alert-output ' + type;
  el.classList.remove('hidden');
  setTimeout(function () {
    el.classList.add('hidden');
  }, 4000);
}

function showScanAlert() {
  alert('📸 GRUPO FOCO detectou uma lousa!\n\nIniciando scan com IA...\n\n✓ Texto reconhecido com 98% de precisão\n✓ PDF gerado automaticamente\n✓ Salvo na nuvem');
  showAlertOutput('✓ Scan realizado! Texto e PDF gerados com sucesso.', 'success');
}

function showPromptDemo() {
  var nota = prompt('📝 Adicionar nota rápida ao GRUPO FOCO:\n\nDigite sua anotação:');

  if (nota === null) {
    showAlertOutput('❌ Operação cancelada.', 'error');
    return;
  }
  if (nota.trim() === '') {
    showAlertOutput('⚠️ Nota vazia não foi adicionada.', 'info');
    return;
  }

  notes.push(nota.trim());
  renderNotes();
  showAlertOutput('✓ Nota adicionada com sucesso!', 'success');
}

function showConfirmDelete() {
  if (notes.length === 0) {
    showAlertOutput('⚠️ Nenhuma nota para deletar. Adicione uma nota primeiro.', 'info');
    return;
  }

  var confirmed = confirm('🗑️ Deletar todas as notas?\n\nEsta ação não pode ser desfeita.');

  if (confirmed) {
    notes.length = 0;
    renderNotes();
    showAlertOutput('✓ Todas as notas foram deletadas.', 'success');
  } else {
    showAlertOutput('❌ Exclusão cancelada.', 'info');
  }
}

function renderNotes() {
  var list = document.getElementById('notesList');
  if (!list) return;
  list.innerHTML = '';

  notes.forEach(function (note, index) {
    var item       = document.createElement('div');
    item.className = 'note-item';
    item.innerHTML =
      '<span>📌 ' + escapeHTML(note) + '</span>' +
      '<button class="note-delete" onclick="deleteNote(' + index + ')" title="Deletar nota">🗑</button>';
    list.appendChild(item);
  });
}

function deleteNote(index) {
  var confirmed = confirm('Deletar esta nota?');
  if (confirmed) {
    notes.splice(index, 1);
    renderNotes();
    showAlertOutput('✓ Nota removida.', 'success');
  }
}

function escapeHTML(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

/*ACCORDION DE FUNCIONALIDADES — features.html Evento de clique com manipulação DOM*/
function toggleFeat(item) {
  var desc   = item.querySelector('.feat-desc');
  var isOpen = item.classList.contains('open');

  // Fecha todos
  document.querySelectorAll('.feat-item').forEach(function (i) {
    i.classList.remove('open');
    var d = i.querySelector('.feat-desc');
    if (d) d.classList.add('hidden');
  });

  // Abre o clicado (se estava fechado)
  if (!isOpen) {
    item.classList.add('open');
    if (desc) desc.classList.remove('hidden');
  }
}

/*SLIDESHOW — gallery.html Manipulação de imagens / elementos com DOM*/
var currentSlide  = 0;
var autoplayTimer = null;
var isAutoplay    = false;

var slides        = document.querySelectorAll('.slide');
var dotsContainer = document.getElementById('slideDots');
var slideCounter  = document.getElementById('slideCounter');

if (slides.length > 0) {
  // Gera os dots dinamicamente
  slides.forEach(function (_, i) {
    var dot       = document.createElement('button');
    dot.className = 'dot-btn' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));

    // Evento de clique no dot
    dot.addEventListener('click', function () {
      goToSlide(i);
    });

    if (dotsContainer) dotsContainer.appendChild(dot);
  });

  updateSlideUI();
}

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  updateSlideUI();
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
}

function updateSlideUI() {
  if (!dotsContainer) return;

  var dots = dotsContainer.querySelectorAll('.dot-btn');
  dots.forEach(function (d, i) {
    d.classList.toggle('active', i === currentSlide);
  });

  if (slideCounter) {
    slideCounter.textContent = (currentSlide + 1) + ' / ' + slides.length;
  }
}

function toggleAutoplay() {
  var btn = document.getElementById('autoplayBtn');
  if (!btn) return;

  if (isAutoplay) {
    clearInterval(autoplayTimer);
    isAutoplay      = false;
    btn.textContent = '▶ Autoplay';
  } else {
    autoplayTimer   = setInterval(function () { changeSlide(1); }, 3000);
    isAutoplay      = true;
    btn.textContent = '⏸ Pausar';
  }
}

/* Navegação por teclado no slideshow */
document.addEventListener('keydown', function (e) {
  if (slides.length === 0) return;
  if (e.key === 'ArrowLeft')  changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
  if (e.key === 'Escape')     closeModal();
});

/* Swipe touch no slideshow */
var touchStartX   = 0;
var slideshowEl   = document.getElementById('slideshow');

if (slideshowEl) {
  slideshowEl.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slideshowEl.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
  }, { passive: true });
}

/*FILTRO DE GALERIA — gallery.html Evento de clique + manipulação de classes DOM */
function filterGallery(btn) {
  var filter = btn.getAttribute('data-filter');

  // Atualiza aba ativa
  document.querySelectorAll('.filter-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  btn.classList.add('active');

  // Mostra / esconde itens
  var items = document.querySelectorAll('.gallery-item');
  items.forEach(function (item) {
    if (filter === 'all' || item.getAttribute('data-category') === filter) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

/*FORMULÁRIO DE CONTATO — contact.html Validação de formulário com DOM*/
function clearError(fieldId) {
  var field = document.getElementById(fieldId);
  var error = document.getElementById(fieldId + '-error');
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

function setError(fieldId, msg) {
  var field = document.getElementById(fieldId);
  var error = document.getElementById(fieldId + '-error');
  if (field) field.classList.add('error');
  if (error) error.textContent = msg;
}

function updateCharCount() {
  var msg   = document.getElementById('contactMsg');
  var count = document.getElementById('charCount');
  if (!msg || !count) return;

  if (msg.value.length > 500) {
    msg.value = msg.value.substring(0, 500);
  }
  count.textContent = msg.value.length;
}

function submitContact() {
  var valid = true;

  var name    = document.getElementById('contactName');
  var email   = document.getElementById('contactEmail');
  var subject = document.getElementById('contactSubject');
  var msg     = document.getElementById('contactMsg');
  var consent = document.getElementById('contactConsent');

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.value.trim().length < 2) {
    setError('contactName', 'Por favor, insira seu nome completo.');
    valid = false;
  }

  if (!email || !emailRegex.test(email.value)) {
    setError('contactEmail', 'Insira um e-mail válido.');
    valid = false;
  }

  if (!subject || subject.value === '') {
    setError('contactSubject', 'Selecione um assunto.');
    valid = false;
  }

  if (!msg || msg.value.trim().length < 10) {
    setError('contactMsg', 'Mensagem deve ter pelo menos 10 caracteres.');
    valid = false;
  }

  if (!consent || !consent.checked) {
    setError('contactConsent', 'Você deve aceitar a Política de Privacidade.');
    valid = false;
  }

  if (!valid) return;

  // Exibe tela de sucesso
  var formDiv    = document.getElementById('contactFormDiv');
  var successDiv = document.getElementById('formSuccess');
  if (formDiv && successDiv) {
    formDiv.classList.add('hidden');
    successDiv.classList.remove('hidden');
  }
}

function resetContactForm() {
  var formDiv    = document.getElementById('contactFormDiv');
  var successDiv = document.getElementById('formSuccess');
  if (!formDiv || !successDiv) return;

  formDiv.classList.remove('hidden');
  successDiv.classList.add('hidden');

  ['contactName', 'contactEmail', 'contactSubject', 'contactMsg'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
    clearError(id);
  });

  var consent = document.getElementById('contactConsent');
  if (consent) consent.checked = false;

  var count = document.getElementById('charCount');
  if (count) count.textContent = '0';
}

function socialClick(e, platform) {
  e.preventDefault();
  alert('🔗 Redirecionando para o ' + platform + ' do GRUPO FOCO...\n\n(Em produção este link abre a página oficial.)');
}

/*MODAL GENÉRICO*/
function openModal(html) {
  var overlay = document.getElementById('modal-overlay');
  var body    = document.getElementById('modal-body');
  if (!overlay || !body) return;

  body.innerHTML           = html;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function showPrivacyPolicy(e) {
  e.preventDefault();
  openModal(
    '<h3>Política de Privacidade</h3>' +
    '<p>O GRUPO FOCO coleta apenas as informações necessárias para o funcionamento do serviço. ' +
    'Seus dados são armazenados com criptografia AES-256 e nunca são vendidos a terceiros.</p>' +
    '<p>Você pode solicitar a exclusão dos seus dados a qualquer momento enviando um e-mail ' +
    'para privacidade@grupofoco.ai.</p>' +
    '<p>Utilizamos cookies essenciais para autenticação e cookies de análise (anonimizados) ' +
    'para melhorar a experiência.</p>'
  );
}

function showTerms(e) {
  e.preventDefault();
  openModal(
    '<h3>Termos de Uso</h3>' +
    '<p>Ao usar o GRUPO FOCO, você concorda em utilizar o serviço apenas para fins legítimos ' +
    'de estudo e produtividade pessoal.</p>' +
    '<p>É proibido usar o GRUPO FOCO para reproduzir, distribuir ou comercializar conteúdo ' +
    'sem autorização dos detentores dos direitos.</p>' +
    '<p>O GRUPO FOCO reserva-se o direito de suspender contas que violem estes termos.</p>'
  );
}

/*LOGIN E CADASTRO — login.html Validação de formulário + manipulação DOM*/
function switchTab(tab) {
  var loginForm    = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  var loginTab     = document.getElementById('loginTab');
  var registerTab  = document.getElementById('registerTab');

  if (!loginForm || !registerForm) return;

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  } else {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
  }
}

function togglePassword(fieldId, btn) {
  var field = document.getElementById(fieldId);
  if (!field) return;

  if (field.type === 'password') {
    field.type      = 'text';
    btn.textContent = '🙈';
  } else {
    field.type      = 'password';
    btn.textContent = '👁';
  }
}

function checkPasswordStrength() {
  var pw     = document.getElementById('regPassword');
  var fill   = document.getElementById('strengthFill');
  var label  = document.getElementById('strengthLabel');
  if (!pw || !fill || !label) return;

  var val      = pw.value;
  var strength = 0;

  if (val.length >= 8)            strength++;
  if (/[A-Z]/.test(val))          strength++;
  if (/[0-9]/.test(val))          strength++;
  if (/[^A-Za-z0-9]/.test(val))  strength++;

  var widths      = ['0%',         '25%',      '50%',      '75%',      '100%'];
  var colors      = ['transparent','#ef4444',  '#f59e0b',  '#3b82f6',  '#10b981'];
  var labels      = ['',           'Fraca',    'Razoável', 'Boa',      'Forte'];
  var labelColors = ['',           '#fca5a5',  '#fde68a',  '#93c5fd',  '#6ee7b7'];

  fill.style.width      = widths[strength];
  fill.style.background = colors[strength];
  label.textContent     = labels[strength];
  label.style.color     = labelColors[strength];
}

function submitLogin() {
  var valid = true;

  var email    = document.getElementById('loginEmail');
  var password = document.getElementById('loginPassword');

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email.value)) {
    setError('loginEmail', 'Insira um e-mail válido.');
    valid = false;
  }

  if (!password || password.value.length < 6) {
    setError('loginPassword', 'Senha deve ter pelo menos 6 caracteres.');
    valid = false;
  }

  if (!valid) return;

  showLoginSuccess();
}

function submitRegister() {
  var valid = true;

  var name    = document.getElementById('regName');
  var email   = document.getElementById('regEmail');
  var password= document.getElementById('regPassword');
  var confirm = document.getElementById('regConfirm');
  var plan    = document.getElementById('regPlan');
  var terms   = document.getElementById('regTerms');

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.value.trim().length < 2) {
    setError('regName', 'Insira seu nome completo.');
    valid = false;
  }

  if (!email || !emailRegex.test(email.value)) {
    setError('regEmail', 'Insira um e-mail válido.');
    valid = false;
  }

  if (!password || password.value.length < 8) {
    setError('regPassword', 'Senha deve ter pelo menos 8 caracteres.');
    valid = false;
  }

  if (!confirm || confirm.value !== password.value) {
    setError('regConfirm', 'As senhas não coincidem.');
    valid = false;
  }

  if (!plan || plan.value === '') {
    setError('regPlan', 'Selecione um plano.');
    valid = false;
  }

  if (!terms || !terms.checked) {
    setError('regTerms', 'Você deve aceitar os Termos de Uso.');
    valid = false;
  }

  if (!valid) return;

  showLoginSuccess();
}

function showLoginSuccess() {
  var overlay = document.getElementById('loginSuccess');
  if (!overlay) return;

  overlay.classList.remove('hidden');

  // Anima barra de redirecionamento
  setTimeout(function () {
    var fill = document.getElementById('redirectFill');
    if (fill) fill.style.width = '100%';
  }, 100);

  // Redireciona para index após 3s
  setTimeout(function () {
    window.location.href = 'index.html';
  }, 3200);
}

function socialLogin(provider) {
  alert('🔗 Conectar com ' + provider + '\n\n(Em produção, este botão inicia o fluxo OAuth com ' + provider + '.)');
}

function showForgotPassword(e) {
  e.preventDefault();
  var email = prompt('Digite seu e-mail para recuperar a senha:');

  if (email === null) return;

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert('❌ E-mail inválido. Tente novamente.');
    return;
  }

  alert('✅ E-mail de recuperação enviado para:\n' + email + '\n\nVerifique sua caixa de entrada.');
}

/*INTERSECTION OBSERVER — fade-in ao rolar Manipulação dinâmica de elementos*/
var animatedEls = document.querySelectorAll(
  '.card, .feat-item, .gallery-item, .gain-item, .pain-item, .contact-item'
);

var fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.animation = 'fadeSlideUp 0.5s ease both';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animatedEls.forEach(function (el) {
  el.style.opacity   = '0';
  el.style.animation = 'none';
  fadeObserver.observe(el);
});

/*LOG DE CONFIRMAÇÃO NO CONSOLE*/
console.log('%cGRUPO FOCO — Sprint 2 Web Development ✓', 'color:#a78bfa;font-size:14px;font-weight:bold;');
console.log('%cPuro JavaScript. Sem frameworks. Sem bibliotecas externas.', 'color:#6b6880;font-size:11px;');