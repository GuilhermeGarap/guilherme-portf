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

// ===== PROJETO DEMO =====
function initializeProjectDemo() {
    // Tabs de projetos
    const projectTabs = document.querySelectorAll('.project-nav-tab');
    const projectContents = document.querySelectorAll('.project-demo-tab');
    
    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const projectId = tab.getAttribute('data-project');
            
            // Remover active de todas as tabs
            projectTabs.forEach(t => t.classList.remove('active'));
            projectContents.forEach(c => c.classList.remove('active'));
            
            // Adicionar active na tab clicada
            tab.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const targetContent = document.getElementById(projectId + '-demo');
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Inicializar slider do projeto ativo
            setTimeout(() => {
                initializeSliders();
            }, 100);
        });
    });

    // Tabs de código
    const codeTabs = document.querySelectorAll('.code-tab-btn');
    const codeContents = document.querySelectorAll('.code-preview');
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Remover active de todas as tabs
            codeTabs.forEach(t => t.classList.remove('active'));
            codeContents.forEach(c => c.classList.remove('active'));
            
            // Adicionar active na tab clicada
            tab.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Botões de copiar código
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeId = btn.getAttribute('data-code');
            const codeElement = document.querySelector(`#${codeId} code`);
            
            if (codeElement) {
                navigator.clipboard.writeText(codeElement.textContent).then(() => {
                    // Feedback visual
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            }
        });
    });
}

// ===== INICIALIZAR SLIDERS =====
function initializeSliders() {
    // Inicializar todos os sliders encontrados
    const sliderContainers = document.querySelectorAll('.project-images-slider');
    sliderContainers.forEach((container, index) => {
        const containerId = container.id || `slider-${index}`;
        if (!container.id) {
            container.id = containerId;
        }
        new SimpleSlider(containerId);
    });
}



// ===== EVENT DELEGATION PARA MODAL =====
document.addEventListener('click', function(event) {
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
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar navegação
    initializeNavigation();
    
    // Smooth scrolling para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mudar background da navbar no scroll
    window.addEventListener('scroll', function() {
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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Implementar envio do formulário
            alert('Formulário enviado! (Funcionalidade em desenvolvimento)');
        });
    }
});