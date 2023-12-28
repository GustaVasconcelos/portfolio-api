import CasoDeUso from "../../shared/casoDeUso";
import Usuario from "../model/usuario";
import ProvedorCriptografia from "./provedorCriptografia";
import RepositorioUsuario from "./repositorioUsuario";
import erros from '../../shared/erros';
import ValidarEntrada from "./validarEntrada";

export type loginUsuarioEntrada = {
    email: string;
    senha: string;
}

class LoginUsuario implements CasoDeUso<loginUsuarioEntrada, Usuario> {
    constructor(
        private provedorDeCriptografia: ProvedorCriptografia,
        private repositorio: RepositorioUsuario,
        private validarEntrada: ValidarEntrada
    ) {}

    async executar(usuario: loginUsuarioEntrada): Promise<Usuario> {
        try {
            this.validarCamposVazios(usuario);
            this.validarEmail(usuario.email);

            const usuarioExistente = await this.verificarUsuario(usuario.email);
            this.validarSenha(usuario.senha, usuarioExistente.senha!);

            return {
                ...usuarioExistente,
                senha: undefined
            };
        } catch (error) {
            throw error;
        }
    }

    private validarCamposVazios(entrada: loginUsuarioEntrada): void {
        const camposVazios = this.validarEntrada.verificarCamposVazios(entrada);
        if (camposVazios) throw new Error(erros.CAMPOS_OBRIGATORIOS);
    }

    private validarSenha(senha: string, senhaBancoDeDados: string): void {
        const compararSenhas = this.provedorDeCriptografia.comparar(senha, senhaBancoDeDados);
        if (!compararSenhas) throw new Error(erros.SENHA_INCORRETA);
    }

    private validarEmail(email: string): void {
        const emailValido = this.validarEntrada.validarEmail(email);
        if (!emailValido) throw new Error(erros.EMAIL_INVALIDO);
    }

    private async verificarUsuario(email: string): Promise<Usuario> {
        try {
            const usuario = await this.repositorio.buscarPorEmail(email);
            if (!usuario) throw new Error(erros.USUARIO_INEXISTENTE);
            return usuario;
        } catch (error) {
            throw error;
        }
    }
}

export default LoginUsuario;
