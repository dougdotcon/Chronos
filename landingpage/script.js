// Chronos Platform - Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 1500);
    }

    // Inicializar todas as funcionalidades
    initCountdown();
    initScrollEffects();
    initMobileMenu();
    initAnimations();
    initCTAButtons();
    initHeaderScroll();
    initCookieConsent();
    initBackToTop();
    initCounters();
    initParticles();
    initTooltips();
    initTestimonialSlider();
});

// Contador numérico para estatísticas
function initCounters() {
    const counterElements = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const countTo = parseInt(element.getAttribute('data-count'));
                
                let startValue = 0;
                let prefix = '';
                let suffix = '';
                
                // Detectar prefixos e sufixos no texto atual
                const currentText = element.textContent;
                if (currentText.startsWith('R$')) {
                    prefix = 'R$ ';
                    startValue = 0;
                }
                
                if (currentText.endsWith('h')) {
                    suffix = 'h';
                    startValue = 0;
                } else if (currentText.endsWith('M')) {
                    suffix = 'M';
                    startValue = 0;
                }
                
                const duration = 2000; // 2 segundos
                const increment = Math.ceil(countTo / (duration / 30)); // Incremento a cada 30ms
                
                const startCount = timestamp => {
                    let currentCount = startValue;
                    
                    const updateCount = () => {
                        currentCount += increment;
                        
                        if (currentCount >= countTo) {
                            currentCount = countTo;
                            element.textContent = prefix + formatNumber(currentCount) + suffix;
                            return;
                        }
                        
                        element.textContent = prefix + formatNumber(currentCount) + suffix;
                        requestAnimationFrame(updateCount);
                    };
                    
                    requestAnimationFrame(updateCount);
                };
                
                startCount();
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.2 });
    
    counterElements.forEach(el => {
        observer.observe(el);
    });
}

// Formatação de números grandes
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 10000) {
        return Math.round(num).toLocaleString('pt-BR');
    } else {
        return Math.round(num);
    }
}

// Countdown Timer
function initCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (!hoursElement || !minutesElement || !secondsElement) return;

    // Definir tempo final (24 horas a partir de agora)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
        }
    }

    // Atualizar a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Efeitos de Scroll
function initScrollEffects() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Considerar o header fixo
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação do indicador de scroll
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.current-sweepstakes');
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Menu Mobile
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animar ícone do hamburger
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fechar menu ao clicar em um link
        navMenu.querySelectorAll('.nav-link, .btn-login, .btn-primary').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Animações de entrada
function initAnimations() {
    // AOS alternativa
    const animateElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('animate-in');
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos para animação
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Animação para outros elementos sem data-aos
    const otherElements = document.querySelectorAll('.feature-card, .prize-card, .transparency-card, .testimonial-card, .sweepstakes-card, .stat-block, .blockchain-verification, .cta-content');
    
    otherElements.forEach(el => {
        if (!el.hasAttribute('data-aos')) {
            observer.observe(el);
        }
    });

    // Animação de digitação para o título
    animateTitle();
}

// Animação do título principal
function animateTitle() {
    const titleMain = document.querySelector('.hero-title-main');
    if (!titleMain) return;

    const text = titleMain.textContent;
    titleMain.textContent = '';
    titleMain.style.opacity = '1';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            titleMain.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(typeWriter, 500);
}

// Efeito de partículas
function initParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição aleatória
        const x = Math.random() * 100; // %
        const y = Math.random() * 100; // %
        
        // Tamanho aleatório
        const size = Math.random() * 3 + 1; // 1-4px
        
        // Velocidade aleatória
        const duration = Math.random() * 20 + 10; // 10-30s
        const delay = Math.random() * 5; // 0-5s
        
        particle.style.cssText = `
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            animation: float ${duration}s ease-in-out ${delay}s infinite alternate;
            opacity: ${Math.random() * 0.7 + 0.3};
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Botão voltar ao topo
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Slider de Depoimentos
function initTestimonialSlider() {
    const slider = document.getElementById('testimonials-slider');
    if (!slider) return;
    
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.nav-prev');
    const nextBtn = slider.querySelector('.nav-next');
    let currentSlide = 0;
    
    function showSlide(index) {
        // Atualizar dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Lógica para mostrar o slide atual
        // (Esta implementação é simples, pode ser expandida para slides reais)
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + dots.length) % dots.length;
            showSlide(currentSlide);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % dots.length;
            showSlide(currentSlide);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Iniciar no primeiro slide
    showSlide(0);
    
    // Auto-rotação dos slides a cada 5 segundos
    setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        showSlide(currentSlide);
    }, 5000);
}

// Cookie Consent
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (!cookieConsent) return;
    
    const acceptBtn = cookieConsent.querySelector('.btn-cookie-accept');
    const settingsBtn = cookieConsent.querySelector('.btn-cookie-settings');
    
    // Verificar se o usuário já aceitou os cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 2000);
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.classList.remove('show');
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // Mostrar modal de configurações de cookies (implementação futura)
            // Por enquanto, apenas aceita todos
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.classList.remove('show');
        });
    }
}

// Tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        const tooltipText = tooltip.querySelector('.tooltip-text');
        if (!tooltipText) return;
        
        // Detectar se o tooltip vai ficar fora da tela
        tooltip.addEventListener('mouseenter', () => {
            const rect = tooltipText.getBoundingClientRect();
            
            if (rect.left < 0) {
                tooltipText.style.left = '0';
                tooltipText.style.transform = 'translateX(0)';
            } else if (rect.right > window.innerWidth) {
                tooltipText.style.left = 'auto';
                tooltipText.style.right = '0';
                tooltipText.style.transform = 'translateX(0)';
            }
        });
    });
}

// Botões CTA
function initCTAButtons() {
    // Botão principal do hero
    const heroPrimaryBtn = document.querySelector('.btn-hero-primary');
    if (heroPrimaryBtn) {
        heroPrimaryBtn.addEventListener('click', function() {
            showModal('signup');
        });
    }

    // Botão demo
    const heroSecondaryBtn = document.querySelector('.btn-hero-secondary');
    if (heroSecondaryBtn) {
        heroSecondaryBtn.addEventListener('click', function() {
            showDemo();
        });
    }

    // Botão do sorteio ativo
    const sweepstakesBtn = document.querySelector('.btn-sweepstakes');
    if (sweepstakesBtn) {
        sweepstakesBtn.addEventListener('click', function() {
            showModal('login');
        });
    }

    // Botões de login/cadastro
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-primary');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showModal('login');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            showModal('signup');
        });
    }

    // Botões dos cards de prêmios
    document.querySelectorAll('.btn-prize').forEach(btn => {
        btn.addEventListener('click', function() {
            showModal('signup');
        });
    });

    // Botão CTA final
    const finalCtaBtn = document.querySelector('.btn-final-cta');
    if (finalCtaBtn) {
        finalCtaBtn.addEventListener('click', function() {
            showModal('signup');
        });
    }
    
    // Botão de verificação blockchain
    const verifyBtn = document.querySelector('.btn-verify');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            window.open('https://etherscan.io/tx/0x7a16bd2e5894b5927c397e42f0e72334f050c858f729a5c0fa43c25d76f276cc', '_blank');
        });
    }
}

// Header com efeito de scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Esconder/mostrar header baseado na direção do scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// Modal simples
function showModal(type) {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let title, description, fields;
    
    if (type === 'login') {
        title = 'Entre na sua conta';
        description = 'Acesse sua conta para participar dos sorteios.';
        fields = `
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-input" placeholder="Seu email">
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Senha</label>
                <input type="password" id="password" class="form-input" placeholder="Sua senha">
            </div>
        `;
        submitText = 'Entrar';
    } else {
        title = 'Crie sua conta';
        description = 'Junte-se a milhares de pessoas e participe dos sorteios.';
        fields = `
            <div class="form-group">
                <label for="name" class="form-label">Nome completo</label>
                <input type="text" id="name" class="form-input" placeholder="Seu nome completo">
            </div>
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-input" placeholder="Seu melhor email">
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Senha</label>
                <input type="password" id="password" class="form-input" placeholder="Crie uma senha segura">
            </div>
        `;
        submitText = 'Cadastrar';
    }
    
    modal.innerHTML = `
        <button class="modal-close" aria-label="Fechar modal"><i class="fas fa-times"></i></button>
        <div class="modal-header">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
        <div class="modal-body">
            ${fields}
        </div>
        <div class="modal-footer">
            <button class="btn-modal-submit">${submitText}</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    
    // Mostrar modal com animação
    setTimeout(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    }, 10);
    
    // Event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    const submitBtn = modal.querySelector('.btn-modal-submit');
    submitBtn.addEventListener('click', () => {
        // Simular envio do formulário
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            closeModal();
            showToast('Ação realizada com sucesso!', 'success');
        }, 1500);
    });
    
    function closeModal() {
        overlay.classList.remove('show');
        modal.classList.remove('show');
        
        setTimeout(() => {
            overlay.remove();
            modal.remove();
        }, 300);
    }
}

// Demonstração da plataforma
function showDemo() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal demo-modal';
    
    modal.innerHTML = `
        <button class="modal-close" aria-label="Fechar demo"><i class="fas fa-times"></i></button>
        <div class="modal-header">
            <h3>Demonstração da Plataforma</h3>
            <p>Veja como funciona a Chronos Platform.</p>
        </div>
        <div class="modal-body">
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    modal.style.maxWidth = '800px';
    
    // Mostrar modal com animação
    setTimeout(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    }, 10);
    
    // Event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    function closeModal() {
        overlay.classList.remove('show');
        modal.classList.remove('show');
        
        setTimeout(() => {
            overlay.remove();
            modal.remove();
        }, 300);
    }
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon;
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        default:
            icon = 'info-circle';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    console.log(`Event tracked: ${eventName}`, properties);
    // Implementação futura de Analytics
}

// Adicionar estilo CSS para o toast (já que não está no CSS principal)
(function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--gradient-card);
            color: var(--marmore-ivory);
            padding: 15px 20px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            border-left: 4px solid var(--ouro-antigo);
            backdrop-filter: blur(10px);
        }
        
        .toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .toast-success {
            border-left-color: var(--verde-sucesso);
        }
        
        .toast-error {
            border-left-color: var(--vermelho-erro);
        }
        
        .toast-icon {
            font-size: 1.5rem;
        }
        
        .toast-success .toast-icon {
            color: var(--verde-sucesso);
        }
        
        .toast-error .toast-icon {
            color: var(--vermelho-erro);
        }
        
        .toast-message {
            font-size: 1rem;
            font-weight: 500;
        }
        
        .video-container {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            max-width: 100%;
        }
        
        .video-container iframe,
        .video-container object,
        .video-container embed {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .particle {
            position: absolute;
        }
    `;
    document.head.appendChild(style);
})();
