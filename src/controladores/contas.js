const express = require('express');
let {banco, contas, saques, depositos, transferencias} = require('../bancodedados');

const listarContas = (req, res) => {
    const {senha_banco} = req.query;

    if(!senha_banco){
        return res.status(400).json({mensagem: 'A senha do banco informada é obrigatória'});
    }    


    if(senha_banco !== banco.senha){
        return res.status(400).json({mensagem: 'A senha do banco informada é invalida'})
    }

    return res.json(contas);
}

const criarConta = (req, res) => {
    const {nome, email, data_nascimento, telefone, senha, cpf} = req.body;
    
    if(!nome || !email || !data_nascimento || !telefone || !senha || !cpf){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios!'});
    }

    const contaExistente = contas.find(conta =>{
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    });

    if (contaExistente){
        return res.status(400).json({mensagem: 'Email ou CPF já existentes!'});
    }

    const novaConta = {
        numero: contas.length + 1 ,
        saldo: 0,
        usuario: {
            nome,
            email,
            data_nascimento,
            telefone,
            cpf,
            senha
            }
    }
    contas.push(novaConta)

    return res.status(201).send();
}

const atualizarUsuarioConta = (req, res) =>{
    const {nome, email, data_nascimento, telefone, senha, cpf} = req.body;
    const {numeroConta} = req.params;

    if(!nome || !email || !data_nascimento || !telefone || !senha || !cpf){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios!'});
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numeroConta));

    if(!contaEncontrada){
        return res.status(404).json({mensagem: 'Conta inexistente!'});
    }

    if(cpf !== contaEncontrada.usuario.cpf){
        const existeCpf = contas.find(conta => conta.usuario.cpf === cpf);

        if(existeCpf){
            return res.status(400).json({mensagem: 'CPF já existente!'});
        }
    }

    if(email !== contaEncontrada.usuario.email){
        const existeEmail = contas.find(conta => conta.usuario.email === email)
        if(existeEmail){
            return res.status(400).json({mensagem: 'Email já existente!'});
        }
    }

    contaEncontrada.usuario = {
        nome,
        email, 
        data_nascimento, 
        telefone, 
        senha, 
        cpf
    }

    return res.status(204).send()
}

const excluirConta = (req, res) => {
    const {numeroConta} = req.params;

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numeroConta));

    if(!contaEncontrada){
        return res.status(404).json({mensagem: 'Conta inexistente!'});
    }

    if(contaEncontrada.saldo > 0){
        return res.status(403).json({mensagem: 'A conta só pode ser excluida se o saldo for 0!'});
    }

    contas = contas.filter(conta => Number(conta.numero) !== Number(numeroConta))

    return res.status(204).send();
}

const saldo = (req, res) =>{
    const {numero_conta, senha} = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({mensagem: "O numero da conta e senha são obrigatórios"})
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta))

    if(!contaEncontrada){
        return res.status(404).json({mensagem: "Conta inexistente"})
    }

    if(contaEncontrada.usuario.senha !== senha){
        return res.status(400).json({mensagem: "Senha invalida"})
    }

    return res.json({saldo: contaEncontrada.saldo})
}

const extrato = (req, res) =>{
    const {numero_conta, senha} = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({mensagem: "O numero da conta e senha são obrigatórios"})
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta))

    if(!contaEncontrada){
        return res.status(404).json({mensagem: "Conta inexistente"})
    }

    if(contaEncontrada.usuario.senha !== senha){
        return res.status(400).json({mensagem: "Senha invalida"})
    }

    const extratoDepositos = depositos.filter(deposito => Number(deposito.numero_conta) === Number(numero_conta))

    const extratoSaques = saques.filter(saque => Number(saque.numero_conta) === Number(numero_conta))

    const transferenciasEnviadas = transferencias.filter(transferencia => Number(transferencia.numero_conta_origem) === Number(numero_conta))

    const transferenciasRecebidas = transferencias.filter(transferencia => Number(transferencia.numero_conta_destino) === Number(numero_conta))

    return res.json({
        depositos: extratoDepositos,
        saques: extratoSaques,
        transferenciasEnviadas,
        transferenciasRecebidas
    })
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    saldo,
    extrato
}