# AVB Brasil - Sistema de Autenticação e Dashboard

Sistema web corporativo moderno desenvolvido para a AVB Brasil, com autenticação segura via Firebase e dashboard interativo.

## 📋 Sobre o Projeto

Sistema completo de autenticação e dashboard corporativo com interface moderna, desenvolvido com HTML, CSS e JavaScript, integrado com Firebase para autenticação e banco de dados.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Recuperação de senha
- Validação em tempo real
- Logout seguro

### 🎨 Interface
- Design moderno com paleta verde e branco
- Carousel automático fullscreen
- Layout totalmente responsivo
- Animações e transições suaves
- Ícones intuitivos

### 📊 Dashboard
- Navegação por seções
- Cards informativos
- Estatísticas em tempo real
- Painel administrativo
- Conteúdo dinâmico

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Authentication, Firestore
- **Estilo**: CSS Grid, Flexbox, Variáveis CSS
- **Ícones**: Emojis nativos

## 📁 Estrutura
avb-sistema/
├── index.html
├── dashboard.html
├── admin.html
├── styles/
│ ├── auth.css
│ └── dashboard.css
└── js/
├── firebase-config.js
├── auth.js
├── dashboard.js
└── firestore.js
## ⚡ Como Usar

1. Abra `index.html` no navegador
2. Cadastre-se com email e senha (mínimo 6 caracteres)
3. Faça login com suas credenciais
4. Navegue pelo dashboard corporativo
5. Acesse o painel admin para ver usuários

## 🔧 Configuração

### Firebase Setup
1. Crie projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication → Email/Senha
3. Crie Firestore Database
4. Configure credenciais em `js/firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-sender-id",
    appId: "seu-app-id"
};
