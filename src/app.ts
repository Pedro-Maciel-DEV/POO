import * as readlineSync from 'readline-sync'

abstract class Emprestimo {
    nomeSolicitante: string;
    idadeSolicitante: number;
    valorTotal: number;
    numeroParcelas: number;
    valorParcela: number;
    rendaMensal: number;

    constructor(
        nomeSolicitante: string,
        idadeSolicitante: number,
        valorTotal: number,
        numeroParcelas: number,
        valorParcela: number,
        rendaMensal: number
    ) {
        this.nomeSolicitante = nomeSolicitante
        this.idadeSolicitante = idadeSolicitante
        this.valorTotal = valorTotal
        this.numeroParcelas = numeroParcelas
        this.valorParcela = valorParcela
        this.rendaMensal = rendaMensal
    }

    abstract verificarAprovacao(): boolean
}

class EmprestimoPessoal extends Emprestimo {
    constructor(
        nomeSolicitante: string,
        idadeSolicitante: number,
        valorTotal: number,
        numeroParcelas: number,
        valorParcela: number,
        rendaMensal: number
    ) {
        super(nomeSolicitante, idadeSolicitante, valorTotal, numeroParcelas, valorParcela, rendaMensal)
    }

    verificarAprovacao(): boolean {
        return this.idadeSolicitante >= 18 && this.rendaMensal > 2500
    }
}

class EmprestimoAutomovel extends Emprestimo {
    habilitacao: boolean;

    constructor(
        nomeSolicitante: string,
        idadeSolicitante: number,
        valorTotal: number,
        numeroParcelas: number,
        valorParcela: number,
        rendaMensal: number,
        habilitacao: boolean
    ) {
        super(nomeSolicitante, idadeSolicitante, valorTotal, numeroParcelas, valorParcela, rendaMensal)
        this.habilitacao = habilitacao
    }

    verificarAprovacao(): boolean {
        return this.idadeSolicitante >= 18 && this.rendaMensal > 3000 && this.habilitacao
    }
}


class EmprestimoEstudantil extends Emprestimo {
    matriculado: boolean

    constructor(
        nomeSolicitante: string,
        idadeSolicitante: number,
        valorTotal: number,
        numeroParcelas: number,
        valorParcela: number,
        rendaMensal: number,
        matriculado: boolean
    ) {
        super(nomeSolicitante, idadeSolicitante, valorTotal, numeroParcelas, valorParcela, rendaMensal)
        this.matriculado = matriculado
    }

    verificarAprovacao(): boolean {
        return (
            this.idadeSolicitante >= 18 &&
            this.idadeSolicitante <= 30 &&
            this.rendaMensal > 1500 &&
            this.matriculado
        );
    }
}
function criarEmprestimo(): Emprestimo {
   
    let tipo: string

    do {
        tipo = readlineSync.question('Digite o tipo de emprestimo (Pessoal, Automovel, Estudantil): ').toLowerCase();

        if (['pessoal', 'automovel', 'estudantil'].includes(tipo)) {
            break
        } else {
            console.log('Tipo de empréstimo inválido. Por favor, digite um tipo válido.')
        }
    } while (true)

    const nome = readlineSync.question('Digite o nome do solicitante: ')
    const idade = parseInt(readlineSync.question('Digite a idade do solicitante: '), 10)
    const valorTotal = parseFloat(readlineSync.question('Digite o valor total do empréstimo: '))
    const numeroParcelas = parseInt(readlineSync.question('Digite o número de parcelas desejadas: '), 10)
    const valorParcela = parseFloat(readlineSync.question('Digite o valor da parcela: '))
    const rendaMensal = parseFloat(readlineSync.question('Digite a renda mensal do solicitante: '))

    if (tipo === 'pessoal') {
        return new EmprestimoPessoal(nome, idade, valorTotal, numeroParcelas, valorParcela, rendaMensal)
    } else if (tipo === 'automovel') {
        const habilitacao = readlineSync.keyInYNStrict('O solicitante possui habilitação?')
        return new EmprestimoAutomovel(nome, idade, valorTotal, numeroParcelas, valorParcela, rendaMensal, habilitacao)
    } else if (tipo === 'estudantil') {
        const matriculado = readlineSync.keyInYNStrict('O solicitante está matriculado em uma instituição de ensino superior?')
        return new EmprestimoEstudantil(nome, idade, valorTotal, numeroParcelas, valorParcela, rendaMensal, matriculado)
    } else {
        throw new Error('Tipo de empréstimo inválido')
    }
}

const solicitacoes: Emprestimo[] = []

let cadastrarNovoEmprestimo = true

while (cadastrarNovoEmprestimo) {
    const emprestimo = criarEmprestimo()
    solicitacoes.push(emprestimo)

    const resposta = readlineSync.keyInYNStrict('Deseja cadastrar outro empréstimo?')
    cadastrarNovoEmprestimo = resposta
}

for (const solicitacao of solicitacoes) {
    const aprovado = solicitacao.verificarAprovacao()
    const status = aprovado ? "APROVADO" : "REPROVADO"
    console.log(`${solicitacao.nomeSolicitante} [${status}]`)
}
