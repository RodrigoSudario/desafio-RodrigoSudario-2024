const recintos = [
    { numero: 1, bioma: "savana", tamanhoTotal: 10, animaisExistentes: [{ especie: "MACACO", quantidade: 3, tamanho: 1 }] },
    { numero: 2, bioma: "floresta", tamanhoTotal: 5, animaisExistentes: [] },
    { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animaisExistentes: [{ especie: "GAZELA", quantidade: 1, tamanho: 2 }] },
    { numero: 4, bioma: "rio", tamanhoTotal: 8, animaisExistentes: [] },
    { numero: 5, bioma: "savana", tamanhoTotal: 9, animaisExistentes: [{ especie: "LEAO", quantidade: 1, tamanho: 3 }] },
];
const animais = {
    LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
    LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
    CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
    MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
    GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
};
class RecintosZoo {
    analisaRecintos(especie, quantidade) {
        // Verificar se o animal é válido
        if (!animais[especie]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        // Verificar se a quantidade é válida
        if (isNaN(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const animal = animais[especie];
        const tamanhoNecessario = animal.tamanho * quantidade;
        let recintosViaveis = [];

        recintos.forEach(recinto => {
            let espacoLivre = recinto.tamanhoTotal;
            let ocupacaoAtual = 0;
            let podeAdicionar = true;

            // Checar se o bioma é compatível
            if (!animal.biomas.includes(recinto.bioma)) {
                podeAdicionar = false;
            }

            // Verificar regras de carnívoros
            const outrosAnimais = recinto.animaisExistentes.filter(a => a.especie !== especie);
            if (animal.carnivoro && outrosAnimais.length > 0) {
                podeAdicionar = false;
            }

            // Calcular ocupação atual
            recinto.animaisExistentes.forEach(a => {
                ocupacaoAtual += a.quantidade * a.tamanho;
            });

            espacoLivre -= ocupacaoAtual;

            // Verificar se há espaço suficiente
            if (espacoLivre < tamanhoNecessario) {
                podeAdicionar = false;
            }

            // Regras de espaço extra
            if (recinto.animaisExistentes.length > 0) {
                espacoLivre -= 1;
                if (espacoLivre < tamanhoNecessario) {
                    podeAdicionar = false;
                }
            }

            // Regras específicas de macacos e hipopótamos
            if (especie === "MACACO" && recinto.animaisExistentes.length === 0) {
                podeAdicionar = false;
            }

            if (especie === "HIPOPOTAMO" && recinto.bioma !== "savana e rio" && outrosAnimais.length > 0) {
                podeAdicionar = false;
            }

            // Se o recinto for viável, calcular o espaço restante
            if (podeAdicionar) {
                espacoLivre -= tamanhoNecessario;
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoLivre,
                    tamanhoTotal: recinto.tamanhoTotal,
                });
            }
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        // Ordenar os recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        return { erro: null, recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.tamanhoTotal})`) };
    }
}

export { RecintosZoo as RecintosZoo };