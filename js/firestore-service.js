// COMENTÁRIO: Serviço para gerenciar dados no Firestore

class FirestoreService {
    constructor() {
        this.db = firebase.firestore();
    }

    // COMENTÁRIO: Salvar perfil do usuário
    async salvarPerfilUsuario(uid, dadosUsuario) {
        try {
            await this.db.collection('usuarios').doc(uid).set({
                ...dadosUsuario,
                dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
                dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, message: 'Perfil salvo com sucesso!' };
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            return { success: false, message: 'Erro ao salvar perfil: ' + error.message };
        }
    }

    // COMENTÁRIO: Buscar perfil do usuário
    async buscarPerfilUsuario(uid) {
        try {
            const doc = await this.db.collection('usuarios').doc(uid).get();
            if (doc.exists) {
                return { success: true, data: doc.data() };
            } else {
                return { success: false, message: 'Perfil não encontrado' };
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            return { success: false, message: 'Erro ao buscar perfil: ' + error.message };
        }
    }

    // COMENTÁRIO: Atualizar perfil do usuário
    async atualizarPerfilUsuario(uid, dadosAtualizados) {
        try {
            await this.db.collection('usuarios').doc(uid).update({
                ...dadosAtualizados,
                dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, message: 'Perfil atualizado com sucesso!' };
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return { success: false, message: 'Erro ao atualizar perfil: ' + error.message };
        }
    }

    // COMENTÁRIO: Salvar imagem de perfil (URL)
    async salvarImagemPerfil(uid, urlImagem) {
        try {
            await this.db.collection('usuarios').doc(uid).update({
                fotoPerfil: urlImagem,
                dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, message: 'Imagem de perfil salva!' };
        } catch (error) {
            console.error('Erro ao salvar imagem:', error);
            return { success: false, message: 'Erro ao salvar imagem: ' + error.message };
        }
    }

    // COMENTÁRIO: Buscar todos os usuários (para admin)
    async buscarTodosUsuarios() {
        try {
            const snapshot = await this.db.collection('usuarios').get();
            const usuarios = [];
            snapshot.forEach(doc => {
                usuarios.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return { success: true, data: usuarios };
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return { success: false, message: 'Erro ao buscar usuários: ' + error.message };
        }
    }

    // COMENTÁRIO: Salvar postagem no blog
    async salvarPostagem(dadosPostagem) {
        try {
            const docRef = await this.db.collection('postagens').add({
                ...dadosPostagem,
                dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'publicado'
            });
            return { success: true, id: docRef.id, message: 'Postagem salva com sucesso!' };
        } catch (error) {
            console.error('Erro ao salvar postagem:', error);
            return { success: false, message: 'Erro ao salvar postagem: ' + error.message };
        }
    }

    // COMENTÁRIO: Buscar postagens
    async buscarPostagens() {
        try {
            const snapshot = await this.db.collection('postagens')
                .orderBy('dataCriacao', 'desc')
                .get();
            const postagens = [];
            snapshot.forEach(doc => {
                postagens.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return { success: true, data: postagens };
        } catch (error) {
            console.error('Erro ao buscar postagens:', error);
            return { success: false, message: 'Erro ao buscar postagens: ' + error.message };
        }
    }

    // COMENTÁRIO: Salvar arquivo no storage e registrar no Firestore
    async salvarArquivoUsuario(uid, dadosArquivo) {
        try {
            const docRef = await this.db.collection('usuarios').doc(uid).collection('arquivos').add({
                ...dadosArquivo,
                dataUpload: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id, message: 'Arquivo salvo com sucesso!' };
        } catch (error) {
            console.error('Erro ao salvar arquivo:', error);
            return { success: false, message: 'Erro ao salvar arquivo: ' + error.message };
        }
    }

    // COMENTÁRIO: Buscar arquivos do usuário
    async buscarArquivosUsuario(uid) {
        try {
            const snapshot = await this.db.collection('usuarios').doc(uid).collection('arquivos')
                .orderBy('dataUpload', 'desc')
                .get();
            const arquivos = [];
            snapshot.forEach(doc => {
                arquivos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return { success: true, data: arquivos };
        } catch (error) {
            console.error('Erro ao buscar arquivos:', error);
            return { success: false, message: 'Erro ao buscar arquivos: ' + error.message };
        }
    }
}

// COMENTÁRIO: Instância global do serviço
const firestoreService = new FirestoreService();