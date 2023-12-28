interface CasoDeUso<Entrada, Saida> {
    executar(entrada: Entrada): Promise <Saida>;
}

export default CasoDeUso;