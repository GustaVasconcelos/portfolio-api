export default interface ProvedorAutenticacaoGoogle {
    verificarToken(tokenGoogle: string): Promise<{ nome: string; email: string; googleId: string }>;
}
