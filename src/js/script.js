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
