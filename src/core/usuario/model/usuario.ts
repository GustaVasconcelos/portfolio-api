interface Usuario {
    id?: string;
    nome?: string;
    email?: string;
    senha?: string;
    googleId?: string;
    metodoLogin?: 'tradicional' | 'google';
    imagemPerfil?: string; 
}

export default Usuario;
