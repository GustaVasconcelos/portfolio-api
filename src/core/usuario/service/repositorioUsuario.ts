import Usuario from "../model/usuario";

interface RepositorioUsuario {
    inserir(usuario: Usuario): Promise <void>;

    buscarPorEmail(email: string): Promise<Usuario>;

    buscarPorId(id: string): Promise<Usuario>;
}

export default RepositorioUsuario;