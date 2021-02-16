const express = require('express')
const server = express()
const router = express.Router()
const fs = require('fs')
server.use(express.json({ extended: true }))

// Função ler arquivo
const readFile = () => {
    const content = fs.readFileSync('./data/clientes.json', 'utf-8')
    return JSON.parse(content)
}

const writeFile = (content) => {
    const updateFile = JSON.stringify(content)
    fs.writeFileSync('./data/clientes.json', updateFile, 'utf-8')
}

// ROTA GET (retorna todos os itens)
router.get('/', function (req, res) {
    const content = readFile()
    res.send(content)
})

// ROTA POST (posta um item novo)
router.post('/', function (req, res) {
    const currentContent = readFile()
    const { nome, endereco, cep, dataDeNascimento, telefone } = req.body
    const cliente_id = Math.random().toString(32).substr(2.9)
    currentContent.push({ cliente_id, nome, endereco, cep, dataDeNascimento, telefone })
    writeFile(currentContent)
    res.send(currentContent)
})

// ROTA PUT (atualiza um item selecionado)
router.put('/:cliente_id', function (req, res) {
    const { cliente_id } = req.params
    const { nome, endereco, cep, dataDeNascimento, telefone } = req.body
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.cliente_id === cliente_id)
    const { cliente_id: cCId, nome: cNome, endereco: cEndereco, cep: cCep, dataDeNascimento: cDataDeNascomento, telefone: cTelefone } = currentContent[selectedItem]
    const newObject = {
        cliente_id: cCId,
        nome: nome ? nome : cNome,
        endereco: endereco ? endereco : cEndereco,
        cep: cep ? cep : cCep,
        dataDeNascimento: dataDeNascimento ? dataDeNascimento : cDataDeNascomento,
        telefone: telefone ? telefone : cTelefone,
    }
    currentContent[selectedItem] = newObject
    writeFile(currentContent)
    res.send(currentContent)
})

//ROTA DELETE(deleta um item selecionado) 

router.delete('/:cliente_id', function (req, res) {
    const { cliente_id } = req.params
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.cliente_id === cliente_id)
    currentContent.splice(selectedItem, 1)
    writeFile(currentContent)
    res.send("Foi Excluido!!")
})

//Função para inicar o servidor na porta 3000, com retono de uma mensagem que esta rodando ok.

server.use(router)
server.listen(3000, function () {
    console.log('Conectado na porta 3000!')
})