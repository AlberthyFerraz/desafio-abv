//  Sistema de autenticação - Login, Cadastro e Recuperação de Senha

// Elementos da DOM
const loginContainer = document.getElementById('loginContainer');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const showRegisterBtn = document.getElementById('showRegister');
const registerModal = document.getElementById('registerModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelRegisterBtn = document.getElementById('cancelRegister');
const registerForm = document.getElementById('registerForm');
const registerMessageDiv = document.getElementById('registerMessage');
const forgotPasswordBtn = document.getElementById('forgotPassword');

//  Modal de recuperação de senha (criado dinamicamente)
let recoveryModal = null;

//  Função para exibir mensagens para o usuário
function showMessage(messageElement, message, type) {
    messageElement.textContent = message;
    messageElement.className = 'message ' + type;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

//  Função para criar modal de recuperação de senha
function createRecoveryModal() {
    if (recoveryModal) return recoveryModal;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'recoveryModal';
    modal.innerHTML = `
        <div class="modal-content recovery-modal">
            <div class="modal-header">
                <div class="modal-logo">
                   <img src="src/logo-avb-removebg-preview.png" alt="logo" class="img-logo">
                </div>
                <h2 class="card-title">Recuperar Senha</h2>
                <p class="card-subtitle">Digite seu e-mail para receber o link de recuperação</p>
                <button id="closeRecoveryModal" class="close-btn">&times;</button>
            </div>
            
            <div id="recoveryMessage" class="message"></div>
            
            <form id="recoveryForm" class="auth-form">
                <div class="form-group">
                    <label for="recoveryEmail">
                        <i class="icon">📧</i>
                        E-mail Cadastrado
                    </label>
                    <input type="email" id="recoveryEmail" placeholder="email@avb.com" required>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="cancelRecovery" class="btn btn-secondary">
                        <i class="btn-icon">←</i>
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <span class="btn-text">Enviar Link</span>
                        <i class="btn-icon">🔑</i>
                    </button>
                </div>
            </form>
            
            <div class="recovery-info">
                <h4>📋 Como funciona:</h4>
                <ul>
                    <li>Digite o e-mail da sua conta</li>
                    <li>Enviaremos um link de recuperação</li>
                    <li>Clique no link no seu e-mail</li>
                    <li>Crie uma nova senha</li>
                    <li>Faça login com a nova senha</li>
                </ul>
            </div>a
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

//  Abrir modal de recuperação de senha
function openRecoveryModal() {
    recoveryModal = createRecoveryModal();
    recoveryModal.style.display = 'flex';
    
    const loginEmail = document.getElementById('email').value;
    if (loginEmail) {
        document.getElementById('recoveryEmail').value = loginEmail;
    }
    
    const closeRecoveryBtn = document.getElementById('closeRecoveryModal');
    const cancelRecoveryBtn = document.getElementById('cancelRecovery');
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryMessageDiv = document.getElementById('recoveryMessage');
    
    function closeRecoveryModal() {
        recoveryModal.style.display = 'none';
        recoveryForm.reset();
        recoveryMessageDiv.style.display = 'none';
    }
    
    closeRecoveryBtn.addEventListener('click', closeRecoveryModal);
    cancelRecoveryBtn.addEventListener('click', closeRecoveryModal);
    
    recoveryModal.addEventListener('click', (e) => {
        if (e.target === recoveryModal) {
            closeRecoveryModal();
        }
    });
    
    recoveryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('recoveryEmail').value;
        
        if (!email) {
            showMessage(recoveryMessageDiv, 'Por favor, digite seu e-mail.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage(recoveryMessageDiv, 'Por favor, digite um e-mail válido.', 'error');
            return;
        }
        
        const submitBtn = recoveryForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-btn">Enviando...</div>';
        submitBtn.disabled = true;
        
        auth.sendPasswordResetEmail(email)
            .then(() => {
                showMessage(recoveryMessageDiv, 
                    '✅ Link de recuperação enviado! Verifique sua caixa de entrada.', 
                    'success'
                );
                recoveryForm.reset();
                
                setTimeout(() => {
                    closeRecoveryModal();
                }, 5000);
            })
            .catch((error) => {
                let errorMessage = 'Erro ao enviar e-mail de recuperação. ';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = '❌ E-mail não encontrado.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = '❌ E-mail inválido.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = '⚠️ Muitas tentativas. Tente novamente em alguns minutos.';
                        break;
                    default:
                        errorMessage = '❌ Erro ao enviar e-mail. Tente novamente.';
                }
                
                showMessage(recoveryMessageDiv, errorMessage, 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

//  Abrir modal de cadastro quando clicar em "Cadastrar"
showRegisterBtn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
    registerForm.reset();
    registerMessageDiv.style.display = 'none';
});

//  Fechar modal de cadastro
function closeRegisterModal() {
    registerModal.style.display = 'none';
    registerForm.reset();
    registerMessageDiv.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeRegisterModal);
cancelRegisterBtn.addEventListener('click', closeRegisterModal);

registerModal.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        closeRegisterModal();
    }
});

//  Abrir modal de recuperação de senha
forgotPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openRecoveryModal();
});

//  Processar formulário de cadastro (SIMPLIFICADO - SEM FIRESTORE)
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showMessage(registerMessageDiv, 'As senhas não coincidem!', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(registerMessageDiv, 'A senha deve ter pelo menos 6 caracteres!', 'error');
        return;
    }

    const submitBtn = registerForm.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-btn">Criando conta...</div>';
    submitBtn.disabled = true;

    //  Criar conta apenas no Authentication 
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showMessage(registerMessageDiv, '🎉 Conta criada com sucesso! Faça login.', 'success');
            
            setTimeout(() => {
                closeRegisterModal();
                document.getElementById('email').value = email;
            }, 2000);
        })
        .catch((error) => {
            let errorMessage = 'Erro ao criar conta. ';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = '❌ Este e-mail já está em uso. Tente fazer login.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = '❌ E-mail inválido. Verifique o formato.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = '⛔ Operação não permitida. Contate o suporte.';
                    break;
                case 'auth/weak-password':
                    errorMessage = '🔒 Senha muito fraca. Use uma senha mais forte.';
                    break;
                default:
                    errorMessage = '❌ Erro ao criar conta. Tente novamente.';
            }
            
            showMessage(registerMessageDiv, errorMessage, 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
});

//  Processar formulário de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Tentando login com:', email); // DEBUG
    
    const submitBtn = loginForm.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-btn">Entrando...</div>';
    submitBtn.disabled = true;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login bem-sucedido:', userCredential.user);
            showMessage(messageDiv, '✅ Login realizado com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        })
        .catch((error) => {
            console.error('Erro completo:', error);
            console.error('Código do erro:', error.code);
            
            let errorMessage = 'Erro ao fazer login. ';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = '❌ E-mail inválido. Verifique o formato.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = '⛔ Conta desativada. Contate o suporte.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = '❌ Usuário não encontrado. Verifique o e-mail.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = '🔒 Senha incorreta. Tente novamente.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = '⚠️ Muitas tentativas. Tente novamente mais tarde.';
                    break;
                default:
                    errorMessage = '❌ Erro ao fazer login: ' + error.message;
            }
            
            showMessage(messageDiv, errorMessage, 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
});

//  Verificar estado de autenticação ao carregar a página
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Usuário já logado, redirecionando...');
        window.location.href = 'dashboard.html';
    }
});

//  Verificar se há parâmetros de recuperação na URL
function checkRecoveryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');
    
    if (mode === 'resetPassword' && oobCode) {
        window.location.href = `reset-password.html?mode=${mode}&oobCode=${oobCode}`;
    }
}

document.addEventListener('DOMContentLoaded', checkRecoveryParams);