import Usuario from "../model/usuario";
import RepositorioUsuario from "./repositorioUsuario";
import ProvedorAutenticacaoGoogle from "./provedorAutenticacaoGoogle";
import CasoDeUso from "../../shared/casoDeUso";
import erros from '../../shared/erros';
import ValidarEntrada from "./validarEntrada";

export type LoginGoogleEntrada = {
    tokenGoogle: string;
};

class LoginGoogleUsuario implements CasoDeUso<LoginGoogleEntrada, Usuario> {
    constructor(
        private repositorio: RepositorioUsuario,
        private provedorAutenticacaoGoogle: ProvedorAutenticacaoGoogle,
        private validarEntrada: ValidarEntrada
    ) {}

    async executar(entrada: LoginGoogleEntrada): Promise<Usuario> {
        this.validarEntradaToken(entrada);

        const dadosGoogle = await this.provedorAutenticacaoGoogle.verificarToken(entrada.tokenGoogle);
        this.validarDadosGoogle(dadosGoogle);

        const usuario = await this.buscarOuInserirUsuario(dadosGoogle);

        const { senha, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
    }

    private validarEntradaToken(entrada: LoginGoogleEntrada): void {
        if (!entrada.tokenGoogle) {
            throw new Error(erros.CAMPOS_OBRIGATORIOS);
        }
    }

    private validarDadosGoogle(dadosGoogle: { nome: string; email: string; googleId: string }): void {
        if (!this.validarEntrada.validarEmail(dadosGoogle.email)) {
            throw new Error(erros.EMAIL_INVALIDO);
        }
    }

    private async buscarOuInserirUsuario(dadosGoogle: { nome: string; email: string; googleId: string }): Promise<Usuario> {
        let usuario = await this.repositorio.buscarPorEmail(dadosGoogle.email);

        if (!usuario) {
            usuario = await this.inserirUsuarioComDadosGoogle(dadosGoogle);
        }

        return usuario;
    }

    private async inserirUsuarioComDadosGoogle(dadosGoogle: { nome: string; email: string; googleId: string }): Promise<Usuario> {
        const novoUsuario: Usuario = {
            nome: dadosGoogle.nome,
            email: dadosGoogle.email,
            googleId: dadosGoogle.googleId,
            metodoLogin: 'google'
        };

        await this.repositorio.inserir(novoUsuario);
        return novoUsuario;
    }
}

export default LoginGoogleUsuario;
