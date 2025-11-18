// COMENTÁRIO: Sistema do Dashboard - Com Swiper para carousel

// COMENTÁRIO: Elementos da DOM do Dashboard
const logoutBtn = document.getElementById('logoutBtn');
const userEmailSpan = document.getElementById('userEmail');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');

// COMENTÁRIO: Variável para o Swiper
let swiper;

// COMENTÁRIO: Inicializar Swiper quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Swiper
    swiper = new Swiper('.swiper', {
        // Configurações do Swiper
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 5000, // Muda a cada 5 segundos
            disableOnInteraction: false,
        },
        speed: 1000, // Transição suave
        effect: 'fade', // Efeito fade entre slides
        fadeEffect: {
            crossFade: true
        },
        
        // Paginação
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        // Navegação
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Keyboard control
        keyboard: {
            enabled: true,
        },
        
        // Mousewheel control
        mousewheel: {
            forceToAxis: true,
        },
        
        // Breakpoints para responsividade
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            1024: {
                slidesPerView: 1,
                spaceBetween: 0
            }
        }
    });
    
    console.log('Swiper inicializado com sucesso!');
});

// COMENTÁRIO: Verificar autenticação ao carregar o dashboard
auth.onAuthStateChanged((user) => {
    if (user) {
        // COMENTÁRIO: Usuário está logado - mostrar informações
        userEmailSpan.textContent = user.email;
        console.log('Usuário logado:', user.email);
        
        // COMENTÁRIO: Iniciar carousel se ainda não estiver iniciado
        if (swiper && !swiper.initialized) {
            swiper.init();
        }
    } else {
        // COMENTÁRIO: Usuário não está logado - redirecionar para login
        console.log('Usuário não autenticado, redirecionando...');
        window.location.href = 'index.html';
    }
});

// COMENTÁRIO: Processar logout
logoutBtn.addEventListener('click', () => {
    // COMENTÁRIO: Confirmar logout
    if (confirm('Tem certeza que deseja sair?')) {
        // COMENTÁRIO: Fazer logout no Firebase
        auth.signOut()
            .then(() => {
                console.log('Logout realizado com sucesso');
                // COMENTÁRIO: Parar o carousel antes de redirecionar
                if (swiper) {
                    swiper.autoplay.stop();
                }
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Erro ao fazer logout:', error);
                alert('Erro ao fazer logout. Tente novamente.');
            });
    }
});

// COMENTÁRIO: Navegação entre seções
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // COMENTÁRIO: Obter a seção alvo do link
        const targetSection = link.getAttribute('data-section');
        
        // COMENTÁRIO: Atualizar navegação
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // COMENTÁRIO: Mostrar seção correspondente
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${targetSection}-section`) {
                section.classList.add('active');
                
                // COMENTÁRIO: Se for a seção inicial, garantir que o carousel está funcionando
                if (targetSection === 'inicio' && swiper) {
                    setTimeout(() => {
                        swiper.update();
                        swiper.autoplay.start();
                    }, 100);
                }
            }
        });
        
        console.log('Navegando para:', targetSection);
    });
});

// COMENTÁRIO: Ações dos botões rápidos
document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelectorAll('.action-btn');
    const slideButtons = document.querySelectorAll('.slide-btn');
    
    // COMENTÁRIO: Ações dos botões do carousel
    slideButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0:
                    alert('Redirecionando para página de Sustentabilidade...');
                    document.querySelector('[data-section="sustentabilidade"]').click();
                    break;
                case 1:
                    alert('Redirecionando para página de Projetos...');
                    // Aqui você pode adicionar a lógica específica
                    break;
                case 2:
                    alert('Redirecionando para página de Resultados...');
                    document.querySelector('[data-section="relatorios"]').click();
                    break;
                case 3:
                    alert('Redirecionando para página de Projetos Ambientais...');
                    document.querySelector('[data-section="sustentabilidade"]').click();
                    break;
            }
        });
    });
    
    // COMENTÁRIO: Ações dos botões rápidos
    actionButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0:
                    alert('Funcionalidade: Novo Relatório\nEm desenvolvimento...');
                    break;
                case 1:
                    document.querySelector('[data-section="noticias"]').click();
                    break;
                case 2:
                    document.querySelector('[data-section="contato"]').click();
                    break;
                case 3:
                    window.location.href = 'admin.html';
                    break;
            }
        });
    });
});

// COMENTÁRIO: Otimizações de performance
window.addEventListener('resize', () => {
    if (swiper) {
        swiper.update();
    }
});

// COMENTÁRIO: Pausar carousel quando a página não está visível
document.addEventListener('visibilitychange', function() {
    if (swiper) {
        if (document.hidden) {
            swiper.autoplay.stop();
        } else {
            swiper.autoplay.start();
        }
    }
});

console.log('Dashboard carregado com Swiper!');
// COMENTÁRIO: Menu Hamburger - Controle do menu mobile
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

// COMENTÁRIO: Abrir menu mobile
hamburgerMenu.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('active');
    hamburgerMenu.classList.add('active');
    document.body.classList.add('menu-open');
});

// COMENTÁRIO: Fechar menu mobile
function closeMobileMenuHandler() {
    mobileMenuOverlay.classList.remove('active');
    hamburgerMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

closeMobileMenu.addEventListener('click', closeMobileMenuHandler);

// COMENTÁRIO: Fechar menu ao clicar em um link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSection = link.getAttribute('data-section');
        
        // Atualizar navegação mobile
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Atualizar navegação desktop também
        const desktopLinks = document.querySelectorAll('.nav-link');
        desktopLinks.forEach(l => {
            if (l.getAttribute('data-section') === targetSection) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });
        
        // Mostrar seção correspondente
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${targetSection}-section`) {
                section.classList.add('active');
            }
        });
        
        // Fechar menu mobile
        closeMobileMenuHandler();
        
        console.log('Navegando para:', targetSection);
    });
});

// COMENTÁRIO: Logout pelo menu mobile
mobileLogoutBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
        auth.signOut()
            .then(() => {
                console.log('Logout realizado com sucesso');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Erro ao fazer logout:', error);
                alert('Erro ao fazer logout. Tente novamente.');
            });
    }
});

// COMENTÁRIO: Fechar menu ao clicar fora (no overlay)
mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        closeMobileMenuHandler();
    }
});

// COMENTÁRIO: Fechar menu com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        closeMobileMenuHandler();
    }
});