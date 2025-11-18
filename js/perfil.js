// Gerenciamento do perfil do usuário com Firestore
class PerfilManager {
    constructor() {
        this.user = null;
        this.perfilData = null;
        this.init();
    }

    async init() {
        // Verificar autenticação
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.user = user;
                await this.carregarPerfil();
                this.carregarArquivos();
            } else {
                window.location.href = 'index.html';
            }
        });

        // Event listeners
        document.getElementById('formPerfil').addEventListener('submit', (e) => this.salvarPerfil(e));
        document.getElementById('fileInput').addEventListener('change', (e) => this.uploadArquivos(e));
        document.getElementById('fotoInput').addEventListener('change', (e) => this.uploadFotoPerfil(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    }
    
    async carregarPerfil() {
        try {
            // Atualizar informações básicas
            document.getElementById('userEmail').textContent = this.user.email;
            document.getElementById('emailUsuario').textContent = this.user.email;
            document.getElementById('iniciaisUsuario').textContent = this.getIniciais(this.user.email);

            // Buscar dados do Firestore
            const resultado = await firestoreService.buscarPerfilUsuario(this.user.uid);
            
            if (resultado.success && resultado.data) {
                this.perfilData = resultado.data;
                this.preencherFormulario();
                this.atualizarEstatisticas();
            } else {
                // Criar perfil básico se não existir
                await this.criarPerfilBasico();
            }

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            this.mostrarMensagem('Erro ao carregar perfil', 'error');
        }
    }

    async criarPerfilBasico() {
        const dadosBasicos = {
            nome: this.user.email.split('@')[0],
            email: this.user.email,
            tipo: 'usuario',
            ativo: true,
            perfilCompleto: false,
            dataCriacao: new Date()
        };

        const resultado = await firestoreService.salvarPerfilUsuario(this.user.uid, dadosBasicos);
        if (resultado.success) {
            this.perfilData = dadosBasicos;
            this.preencherFormulario();
        }
    }

    preencherFormulario() {
        if (!this.perfilData) return;

        // Preencher campos do formulário
        document.getElementById('nomeCompleto').value = this.perfilData.nome || '';
        document.getElementById('nomeUsuario').textContent = this.perfilData.nome || 'Usuário';
        document.getElementById('telefone').value = this.perfilData.telefone || '';
        document.getElementById('cargo').value = this.perfilData.cargo || '';
        document.getElementById('departamento').value = this.perfilData.departamento || '';
        document.getElementById('bio').value = this.perfilData.bio || '';

        // Atualizar iniciais
        if (this.perfilData.nome) {
            document.getElementById('iniciaisUsuario').textContent = this.getIniciais(this.perfilData.nome);
        }

        // Data de cadastro
        if (this.perfilData.dataCriacao) {
            const data = this.perfilData.dataCriacao.toDate();
            document.getElementById('dataCadastro').textContent = data.toLocaleDateString('pt-BR');
            
            // Calcular dias ativo
            const diasAtivo = Math.floor((new Date() - data) / (1000 * 60 * 60 * 24));
            document.getElementById('diasAtivo').textContent = diasAtivo;
        }
    }

    async salvarPerfil(e) {
        e.preventDefault();
        
        try {
            const dadosAtualizados = {
                nome: document.getElementById('nomeCompleto').value,
                telefone: document.getElementById('telefone').value,
                cargo: document.getElementById('cargo').value,
                departamento: document.getElementById('departamento').value,
                bio: document.getElementById('bio').value,
                perfilCompleto: true
            };

            const resultado = await firestoreService.atualizarPerfilUsuario(this.user.uid, dadosAtualizados);
            
            if (resultado.success) {
                this.perfilData = { ...this.perfilData, ...dadosAtualizados };
                this.mostrarMensagem('Perfil atualizado com sucesso!', 'success');
                this.preencherFormulario();
            } else {
                throw new Error(resultado.message);
            }

        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            this.mostrarMensagem('Erro ao salvar perfil: ' + error.message, 'error');
        }
    }

    async uploadFotoPerfil(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Aqui você implementaria o upload para Firebase Storage
            // Por enquanto, vamos simular uma URL de imagem
            const urlSimulada = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.perfilData.nome)}&background=2E7D32&color=fff&size=150`;
            
            const resultado = await firestoreService.salvarImagemPerfil(this.user.uid, urlSimulada);
            
            if (resultado.success) {
                // Atualizar visualmente a foto
                const fotoElement = document.getElementById('fotoPerfil');
                fotoElement.innerHTML = `
                    <img src="${urlSimulada}" alt="Foto de perfil">
                    <button class="upload-foto" onclick="document.getElementById('fotoInput').click()">📷</button>
                `;
                this.mostrarMensagem('Foto de perfil atualizada!', 'success');
            }

        } catch (error) {
            console.error('Erro ao upload foto:', error);
            this.mostrarMensagem('Erro ao fazer upload da foto', 'error');
        }
    }

    async uploadArquivos(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            for (const file of files) {
                const dadosArquivo = {
                    nome: file.name,
                    tipo: file.type,
                    tamanho: file.size,
                    nomeOriginal: file.name
                };

                const resultado = await firestoreService.salvarArquivoUsuario(this.user.uid, dadosArquivo);
                
                if (resultado.success) {
                    this.mostrarMensagem(`Arquivo "${file.name}" salvo com sucesso!`, 'success');
                }
            }

            // Recarregar lista de arquivos
            await this.carregarArquivos();

        } catch (error) {
            console.error('Erro ao upload arquivos:', error);
            this.mostrarMensagem('Erro ao fazer upload dos arquivos', 'error');
        }
    }

    async carregarArquivos() {
        try {
            const resultado = await firestoreService.buscarArquivosUsuario(this.user.uid);
            
            if (resultado.success) {
                this.exibirArquivos(resultado.data);
                document.getElementById('totalArquivos').textContent = resultado.data.length;
            }

        } catch (error) {
            console.error('Erro ao carregar arquivos:', error);
        }
    }

    exibirArquivos(arquivos) {
        const container = document.getElementById('listaArquivos');
        
        if (arquivos.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--cinza-escuro);">Nenhum arquivo salvo ainda.</p>';
            return;
        }

        container.innerHTML = arquivos.map(arquivo => `
            <div class="arquivo-card">
                <div class="arquivo-icon">📄</div>
                <h4>${arquivo.nome}</h4>
                <p style="color: var(--cinza-escuro); font-size: 0.9rem;">
                    ${this.formatarTamanho(arquivo.tamanho)}<br>
                    ${arquivo.dataUpload ? arquivo.dataUpload.toDate().toLocaleDateString('pt-BR') : 'Data não disponível'}
                </p>
            </div>
        `).join('');
    }

    atualizarEstatisticas() {
        // Atualizar outras estatísticas aqui
        document.getElementById('ultimoAcesso').textContent = 'Hoje';
    }

    getIniciais(nome) {
        return nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    formatarTamanho(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    mostrarMensagem(mensagem, tipo) {
    // Sistema de mensagens seguro
    const cores = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    const icones = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    try {
        // Tentar usar o sistema de mensagens existente
        let messageContainer = document.querySelector('.message-system');
        
        if (!messageContainer) {
            // Criar container de mensagens se não existir
            messageContainer = document.createElement('div');
            messageContainer.className = 'message-system';
            messageContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(messageContainer);
        }
        
        // Criar elemento de mensagem
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            background: ${cores[tipo] || '#333'};
            color: white;
            padding: 16px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        messageElement.innerHTML = `
            <span style="font-size: 18px;">${icones[tipo] || '💬'}</span>
            <span>${mensagem}</span>
        `;
        
        messageContainer.appendChild(messageElement);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.parentNode.removeChild(messageElement);
                    }
                }, 300);
            }
        }, 5000);
        
    } catch (error) {
        // Fallback ultimate - console + alert
        console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
        
        // Alert estilizado
        const alertMessage = `${icones[tipo] || '💬'} ${mensagem}`;
        alert(alertMessage);
    }
}

    logout() {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    }
}

// Inicializar gerenciador de perfil
new PerfilManager();
