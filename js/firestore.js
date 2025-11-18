// Funções para trabalhar com o Firestore

// Buscar todos os usuários (apenas admin)
function buscarTodosUsuarios() {
    return db.collection('usuarios').get()
        .then((querySnapshot) => {
            const usuarios = [];
            querySnapshot.forEach((doc) => {
                usuarios.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return usuarios;
        })
        .catch((error) => {
            console.error("Erro ao buscar usuários:", error);
            throw error;
        });
}

// Buscar dados do usuário logado
function buscarDadosUsuario(uid) {
    return db.collection('usuarios').doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data();
            } else {
                throw new Error("Usuário não encontrado no banco de dados");
            }
        });
}

// COMENTÁRIO: Salvar postagem no blog
function salvarPostagem(titulo, conteudo, autor) {
    return db.collection('postagens').add({
        titulo: titulo,
        conteudo: conteudo,
        autor: autor,
        dataPublicacao: new Date(),
        status: 'publicado'
    });
}

//  Buscar todas as postagens
function buscarPostagens() {
    return db.collection('postagens')
        .orderBy('dataPublicacao', 'desc')
        .get()
        .then((querySnapshot) => {
            const postagens = [];
            querySnapshot.forEach((doc) => {
                postagens.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return postagens;
        });
}

// Atualizar perfil do usuário
function atualizarPerfilUsuario(uid, dados) {
    return db.collection('usuarios').doc(uid).update(dados);
}