// ===== NAVEGAÇÃO =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// ===== SLIDER SIMPLES E ROBUSTO =====
class SimpleSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.slides = this.container.querySelectorAll('.slider-slide');
        this.dots = this.container.querySelectorAll('.slider-dots .dot');
        this.prevBtn = this.container.querySelector('.slider-btn.prev');
        this.nextBtn = this.container.querySelector('.slider-btn.next');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;

        if (this.totalSlides === 0) return;

        this.init();
    }

    init() {
        // Mostrar primeiro slide
        this.showSlide(0);

        // Event listeners para botões
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Event listeners para dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Event listeners para imagens (modal)
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('click', () => {
                    this.openModal(img.src, img.alt || `Imagem ${index + 1}`, index);
                });
            }
        });
    }

    showSlide(index) {
        // Esconder todos os slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Remover classe active de todos os dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Mostrar slide atual
        if (this.slides[index]) {
            this.slides[index].style.display = 'block';
        }

        // Ativar dot atual
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }

        this.currentIndex = index;
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }

    openModal(src, caption, index) {
        // Armazenar informações do slider atual no modal
        window.currentModalSlider = this;
        window.currentModalIndex = index;
        window.modalImages = Array.from(this.slides).map(slide => {
            const img = slide.querySelector('img');
            return img ? img.src : '';
        });
        window.modalCaptions = Array.from(this.slides).map(slide => {
            const img = slide.querySelector('img');
            return img ? (img.alt || 'Imagem') : 'Imagem';
        });

        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const modalDots = document.getElementById('modalDots');

        if (modal && modalImg && modalCaption) {
            modalImg.src = src;
            modalCaption.textContent = caption;
            modal.style.display = 'flex';

            // Gerar dots do modal dinamicamente
            if (modalDots) {
                modalDots.innerHTML = '';
                for (let i = 0; i < this.totalSlides; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'modal-dot';
                    if (i === index) dot.classList.add('active');
                    dot.addEventListener('click', () => goToModalSlide(i));
                    modalDots.appendChild(dot);
                }
            }
        }
    }
}

// ===== MODAL DE IMAGEM =====
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function navigateModal(direction) {
    if (!window.currentModalSlider || window.modalImages.length === 0) return;

    const newIndex = (window.currentModalIndex + direction + window.modalImages.length) % window.modalImages.length;
    window.currentModalIndex = newIndex;

    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalDots = document.querySelectorAll('.modal-dot');

    if (modalImg && modalCaption) {
        modalImg.src = window.modalImages[newIndex];
        modalCaption.textContent = window.modalCaptions[newIndex];

        // Atualizar dots do modal
        modalDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === newIndex);
        });
    }
}

function goToModalSlide(index) {
    if (!window.currentModalSlider || window.modalImages.length === 0) return;

    if (index >= 0 && index < window.modalImages.length) {
        window.currentModalIndex = index;

        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const modalDots = document.querySelectorAll('.modal-dot');

        if (modalImg && modalCaption) {
            modalImg.src = window.modalImages[index];
            modalCaption.textContent = window.modalCaptions[index];

            // Atualizar dots do modal
            modalDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }
}

// ===== ÂNCORAS & NAVEGAÇÃO POR HASH =====
const DEMO_SECTION_ID = 'projects';
const EXPERIENCE_SECTION_ID = 'experience';
const PROJECT_TAB_IDS = ['physio', 'doces', 'transport'];
const HASH_ALIASES = {
    'project-tech-demo': DEMO_SECTION_ID,
    demonstracao: DEMO_SECTION_ID,
    demo: DEMO_SECTION_ID
};

let anchorScrollTimer = null;

function normalizeHash(hash) {
    if (!hash) return '';
    let id = hash.startsWith('#') ? hash.slice(1) : hash;
    try {
        id = decodeURIComponent(id);
    } catch (_) {
        // mantém o valor original se a decodificação falhar
    }
    return id.replace(/["'<>]/g, '').trim();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element) return false;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
}

function handlePortfolioHash() {
    const rawHash = normalizeHash(window.location.hash);
    if (!rawHash) return;

    const sectionId = PROJECT_TAB_IDS.includes(rawHash)
        ? DEMO_SECTION_ID
        : (HASH_ALIASES[rawHash] || rawHash);

    const tryNavigate = () => {
        const scrolled = scrollToSection(sectionId);
        if (scrolled && PROJECT_TAB_IDS.includes(rawHash) && typeof window.activateProjectTab === 'function') {
            window.activateProjectTab(rawHash);
        }
        return scrolled;
    };

    if (tryNavigate()) return;

    clearInterval(anchorScrollTimer);
    let attempts = 0;
    anchorScrollTimer = setInterval(() => {
        if (tryNavigate() || ++attempts >= 50) {
            clearInterval(anchorScrollTimer);
        }
    }, 150);
}

// ===== PROJETO DEMO =====
const initializedSliders = new Set();
let projectDemoListenersBound = false;

function ensureCodePreviewVisible(projectPanel) {
    const codeTabs = projectPanel.querySelector('.code-tabs');
    if (!codeTabs) return;

    if (codeTabs.querySelector('.code-preview.active')) return;

    const firstBtn = codeTabs.querySelector('.code-tab-btn');
    const firstPreview = codeTabs.querySelector('.code-preview');
    codeTabs.querySelectorAll('.code-tab-btn').forEach(t => t.classList.remove('active'));
    codeTabs.querySelectorAll('.code-preview').forEach(c => c.classList.remove('active'));
    if (firstBtn) firstBtn.classList.add('active');
    if (firstPreview) firstPreview.classList.add('active');
}

function initializeSliderFor(root = document) {
    const sliderContainers = root.querySelectorAll('.project-images-slider');
    sliderContainers.forEach((container, index) => {
        const containerId = container.id || `slider-${index}`;
        if (!container.id) {
            container.id = containerId;
        }

        if (initializedSliders.has(containerId)) {
            const hasVisibleSlide = Array.from(container.querySelectorAll('.slider-slide'))
                .some(slide => slide.style.display === 'block');
            if (!hasVisibleSlide) {
                const firstSlide = container.querySelector('.slider-slide');
                if (firstSlide) firstSlide.style.display = 'block';
            }
            return;
        }

        initializedSliders.add(containerId);
        new SimpleSlider(containerId);
    });
}

function activateProjectTab(projectId) {
    if (!projectId) return;

    document.querySelectorAll('.project-nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.project-demo-tab').forEach(c => c.classList.remove('active'));

    const activeTab = document.querySelector(`.project-nav-tab[data-project="${projectId}"]`);
    if (activeTab) activeTab.classList.add('active');

    const targetContent = document.getElementById(`${projectId}-demo`);
    if (!targetContent) return;

    targetContent.classList.add('active');
    ensureCodePreviewVisible(targetContent);
    initializeSliderFor(targetContent);
}

window.activateProjectTab = activateProjectTab;

function bindProjectDemoListeners() {
    if (projectDemoListenersBound) return;
    projectDemoListenersBound = true;

    // Delegation: funciona mesmo com HTML injetado depois via fetch
    document.addEventListener('click', (event) => {
        const projectTab = event.target.closest('.project-nav-tab');
        if (projectTab) {
            activateProjectTab(projectTab.getAttribute('data-project'));
            return;
        }

        const demoBtn = event.target.closest('.demo-btn');
        if (demoBtn) {
            const projectId = demoBtn.getAttribute('data-project');
            if (!projectId) return;

            const demoSection = document.getElementById(DEMO_SECTION_ID);
            if (!demoSection) return;

            demoSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => activateProjectTab(projectId), 100);
            return;
        }

        const codeTab = event.target.closest('.code-tab-btn');
        if (codeTab) {
            const tabId = codeTab.getAttribute('data-tab');
            const codeTabs = codeTab.closest('.code-tabs');
            if (!codeTabs || !tabId) return;

            // Escopo só deste projeto — antes limpava .active de TODOS os demos
            codeTabs.querySelectorAll('.code-tab-btn').forEach(t => t.classList.remove('active'));
            codeTabs.querySelectorAll('.code-preview').forEach(c => c.classList.remove('active'));
            codeTab.classList.add('active');

            const targetContent = document.getElementById(tabId);
            if (targetContent) targetContent.classList.add('active');
            return;
        }

        const copyBtn = event.target.closest('.btn-copy');
        if (copyBtn) {
            const codeId = copyBtn.getAttribute('data-code');
            const codeElement = document.querySelector(`#${codeId} code`);
            if (!codeElement) return;

            navigator.clipboard.writeText(codeElement.textContent).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            });
        }
    });
}

function initializeProjectDemo() {
    bindProjectDemoListeners();

    const activePanel = document.querySelector('.project-demo-tab.active');
    if (activePanel) {
        ensureCodePreviewVisible(activePanel);
        initializeSliderFor(activePanel);
    }
}

// Listeners podem ir cedo; o HTML dos componentes chega depois via fetch
bindProjectDemoListeners();

// ===== INICIALIZAR SLIDERS =====
function initializeSliders() {
    initializeSliderFor(document);
}



// ===== EVENT DELEGATION PARA MODAL =====
document.addEventListener('click', function (event) {
    // Fechar modal ao clicar fora
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeImageModal();
    }

    // Fechar modal com botão X
    if (event.target.closest('.close-modal')) {
        closeImageModal();
    }

    // Navegação do modal
    if (event.target.closest('.modal-nav-btn.prev')) {
        navigateModal(-1);
    }

    if (event.target.closest('.modal-nav-btn.next')) {
        navigateModal(1);
    }
});

// ===== INICIALIZAÇÃO GERAL =====
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar navegação
    initializeNavigation();

    // Smooth scrolling para links internos (inclui componentes carregados depois)
    document.addEventListener('click', function (event) {
        const anchor = event.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = normalizeHash(anchor.getAttribute('href'));
        if (!targetId) return;

        event.preventDefault();
        window.location.hash = targetId;
        handlePortfolioHash();
    });

    window.addEventListener('hashchange', handlePortfolioHash);

    // Mudar background da navbar no scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Sistema de tradução já inicializado via translations.js

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Implementar envio do formulário
            alert('Formulário enviado! (Funcionalidade em desenvolvimento)');
        });
    }
});