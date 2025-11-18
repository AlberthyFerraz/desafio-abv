// Configuração do Firebase com Firestore
const firebaseConfig = {
    apiKey: "AIzaSyCot-V0eR9AJ9-MH-LP8m2aGCdYejh1mO8",
    authDomain: "avb-banco-de-dados.firebaseapp.com",
    projectId: "avb-banco-de-dados",
    storageBucket: "avb-banco-de-dados.firebasestorage.app",
    messagingSenderId: "859788436423",
    appId: "1:859788436423:web:1f4281bee5b34b2c9eafe2",
    measurementId: "G-HQTHZ1H3HZ"
};

//  Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referência para os serviços
const auth = firebase.auth();
const analytics = firebase.analytics();
const db = firebase.firestore(); // Firestore Database

//  Configurações do Firestore para desenvolvimento
db.settings({
    timestampsInSnapshots: true
});