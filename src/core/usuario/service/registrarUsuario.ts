import CasoDeUso from "../../shared/casoDeUso";
import Usuario from "../model/usuario";
import ProvedorCriptografia from "./provedorCriptografia";
import ValidarEntrada from "./validarEntrada";
import RepositorioUsuario from "./repositorioUsuario";
import erros from '../../shared/erros';
import Id from "../../shared/id";

export type registrarUsuarioEntrada = {
    nome: string
    email: string;
    senha: string;
    senhaNovamente: string;
}

class RegistrarUsuario implements CasoDeUso<registrarUsuarioEntrada, void> {
    constructor(
        private provedorCripto: ProvedorCriptografia,
        private repositorio: RepositorioUsuario,
        private validarEntrada: ValidarEntrada
    ) {}

    async executar(usuario: registrarUsuarioEntrada): Promise<void> {
        try {
            this.validarCamposVazios(usuario);
            this.validarEmail(usuario.email);
            this.validarSenhasIguais(usuario.senha, usuario.senhaNovamente);

            await this.verificarUsuarioExistente(usuario.email);
            
            const senhaCriptografada = this.provedorCripto.criptografar(usuario.senha);

            const novoUsuario: Usuario = {
                id: Id.gerarHash(),
                nome: usuario.nome,
                email: usuario.email,
                senha: senhaCriptografada
            }

            await this.repositorio.inserir(novoUsuario);
        } catch (error) {
            throw error;
        }
    }

    private validarCamposVazios(entrada: registrarUsuarioEntrada): void {
        const camposVazios = this.validarEntrada.verificarCamposVazios(entrada);
        if (camposVazios) throw new Error(erros.CAMPOS_OBRIGATORIOS);
    }

    private validarSenhasIguais(senha: string, senhaConfirmacao: string): void {
        const senhasSaoIguais = this.validarEntrada.compararSenhas(senha, senhaConfirmacao);
        if (!senhasSaoIguais) throw new Error(erros.SENHAS_DIFERENTES);
    }

    private validarEmail(email: string): void {
        const emailValido = this.validarEntrada.validarEmail(email);
        if (!emailValido) throw new Error(erros.EMAIL_INVALIDO);
    }

    private async verificarUsuarioExistente(email: string): Promise<void> {
        const usuario = await this.repositorio.buscarPorEmail(email);
        if (usuario) throw new Error(erros.USUARIO_EXISTENTE);
    }
}

export default RegistrarUsuario;
