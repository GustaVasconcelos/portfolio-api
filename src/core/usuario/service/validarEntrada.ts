interface ValidarEntrada {
    validarEmail(email: string): boolean;

    verificarCamposVazios(obj: Record<string, string>): boolean;

    compararSenhas(senha: string, senhaBancoDeDados: string): boolean;
}

export default ValidarEntrada;