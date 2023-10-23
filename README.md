![](https://i.imgur.com/xG74tOh.png)

# Desafio | Back-end - Módulo 2

Você acabou de ser contratado pela melhor empresa de tecnologia do mundo: a **CUBOS**.
Sua primeira tarefa como desenvolvedor é criar uma API para o banco digital Cubos Bank.  
Esse será um projeto **piloto**, ou seja, no futuro outras funcionalidades serão implementadas, portanto, dados do banco (nome, agência, etc.) serão imutáveis.

Seu papel é construir uma RESTful API que permita:
-   Listagem de contas bancárias
-   Criar conta bancária
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depositar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário

**IMPORTANTE: Sempre que a validação de uma requisição falhar, responda com código de erro e mensagem adequada à situação, ok?**

**Exemplo:**

```javascript
// Quando é informado um número de conta que não existe:
// HTTP Status 404
{
    "mensagem": "Conta não encontrada"
}
```

---

## **Persistências dos dados**

Os dados serão persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. Todas as transações e contas bancárias deverão ser inseridas dentro deste objeto, seguindo a estrutura que já existe.

### **Estrutura do objeto no arquivo `bancodedados.js`**

```javascript
{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```

**IMPORTANTE: Este arquivo não pode ser alterado ou removido do projeto.**  
**Portanto, a nomenclatura das propriedades `banco`, `contas`, `saques`, `depositos`, `transferencias`, assim como os valores atribuídos as propriedades `nome`, `numero`, `agencia` e `senha` não devem ser alterados.**

---

## **Requisitos obrigatórios**

-   Sua API deve seguir o padrão REST
-   Seu código deve estar organizado, delimitando as responsabilidades de cada arquivo adequadamente. Ou seja, é esperado que ele tenha, no mínimo:
    -   Um arquivo index.js
    -   Um arquivo servidor.js
    -   Um arquivo de rotas
    -   Uma pasta com controladores
-   Qualquer valor (dinheiro) deverá ser representado em centavos (Ex.: R$ 10,00 reais = 1000)
-   Evite códigos duplicados. Antes de copiar e colar, pense se não faz sentido esse pedaço de código estar centralizado numa função.

---

## Status Code

Abaixo, listamos os possíveis `status code` esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
// 500 (Internal Server Error) = erro inesperado do servidor
```

---

## **Endpoints**

### **Listar contas bancárias**

#### `GET` `/contas?senha_banco=123`

Essa é a rota que será utilizada para listar todas as contas bancárias existentes.

-   **Requisição**  

    Parâmetro do tipo query **`senha_banco`**.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (contas) encontradas.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Verificar se o parâmetro de query **`senha_banco`** foi informado na requisição
    -   Validar se a senha informada confere com a senha do banco, que temos armazenada no arquivo `bancodedados.js`

#### **Exemplo de requisição**

```javascript
// GET /contas?senha_banco=senha-do-banco
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// 2 contas encontradas
[
    {
        numero: "1",
        saldo: 0,
        usuario: {
            nome: 'Foo Bar',
            cpf: '00011122233',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'foo@bar.com',
            senha: '1234'
        }
    },
    {
        numero: "2",
        saldo: 1000,
        usuario: {
            nome: 'Foo Bar 2',
            cpf: '00011122234',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'foo@bar2.com',
            senha: '12345'
        }
    }
]

// HTTP Status 200 / 201
// nenhuma conta encontrada
[]
```

### **Criar conta bancária**

#### `POST` `/contas`

Essa é a rota que será utilizada para criar uma conta bancária, onde será gerado um número único para identificação de cada conta.

-   **Requisição**

    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`numero`** que deverá possuir o número gerado exclusivamente para a conta em questão criada, a propriedade **`saldo`** que deverá possuir valor inicial zerado e a propriedade **`usuario`** que deverá possuir as informações do usuário da conta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Validar os campos obrigatórios:
        -   nome
        -   cpf
        -   data_nascimento
        -   telefone
        -   email
        -   senha
    -   CPF deve ser um campo único.
    -   E-mail deve ser um campo único.
    -   Definir o saldo inicial da conta como 0
    -   Criar uma nova conta cujo número seja único

#### **Exemplo de requisição**

```javascript
// POST /contas
{
    "nome": "Foo Bar",
    "email": "foo@bar.com",
    "cpf": "00011122233",
    "data_nascimento": "15/03/2001",
    "telefone": "11999998888",
    "senha": "1234"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// sucesso ao cadastrar
{
    numero:  "1",
    saldo: 0,
    usuario: {
        nome: "Foo Bar",
        cpf: "00011122233",
        data_nascimento: "2001-03-15",
        telefone: "11999998888",
        email: "foo@bar.com",
        senha: "1234"
    }
}

// HTTP Status 400, 404
// erro ao cadastrar
{
    mensagem: 'Mensagem de erro'
}
```

### **Atualizar usuário da conta bancária**

#### `PUT` `/contas/:numeroConta/usuario`

Essa é a rota que será utilizada para atualizar os dados do usuário de uma conta bancária.

-   **Requisição**

    Parâmetro do tipo rota **`numeroConta`**.  
    O corpo (body) deverá possuir um objeto contendo uma ou até mesmo todas as seguintes propriedades (respeitando estes nomes):

        -   nome
        -   cpf
        -   data_nascimento
        -   telefone
        -   email
        -   senha

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`mensagem`** que deverá possuir um texto informativo para orientar que os dados foram atualizados com sucesso.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Verificar se o parâmetro de rota **`numeroConta`** informado na requisição pertence a alguma conta
    -   Verificar se foi passado, ao menos, uma propriedade no corpo (body) da requisição
    -   Se o CPF for informado, verificar se já existe outro registro com o mesmo CPF
    -   Se o E-mail for informado, verificar se já existe outro registro com o mesmo E-mail
    -   Atualizar um ou mais campos dos dados do usuário de uma conta bancária;

#### **Exemplos de requisição**

```javascript
// PUT /contas/1/usuario
// informando apenas um campo para atualizar
{
    "nome": "Bar Foo"
}

// informando todos os campos para atualizar
{
    "nome": "Bar Foo",
    "email": "bar@foo.com",
    "cpf": "33322211100",
    "data_nascimento": "03/05/2010",
    "telefone": "11988889999",
    "senha": "4321"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// sucesso ao atualizar
{
    mensagem: "Conta atualizada com sucesso"
}

// HTTP Status 400, 404
// erro ao atualizar
{
    mensagem: "Mensagem de erro"
}
```

### **Excluir Conta**

#### `DELETE` `/contas/:numeroConta`

Essa é a rota que será utilizada para excluir uma conta bancária existente.

-   **Requisição**

    Parâmetro do tipo rota **`numeroConta`**.
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`mensagem`** que deverá possuir um texto informativo para orientar que a conta foi excluída com sucesso. 
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Verificar se o valor atribuído ao parâmetro de rota **`numeroConta`** informado na requisição pertence a alguma conta
    -   Verificar se o saldo da conta bancária em questão é zero, pois, não será permitido excluir conta bancária que possua saldo em conta.
    -   Remover a conta do objeto de persistência de dados.

#### **Exemplo de requisição**

```javascript
// DELETE /contas/1
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// sucesso ao excluir
{
    mensagem: "Conta excluída com sucesso"
}

// HTTP Status 400, 404
// erro ao excluir
{
    mensagem: "Mensagem de erro"
}
```

### **Depositar**

#### `POST` `/transacoes/depositar`

Essa é a rota que será utilizada para somar o valor do depósito ao saldo de uma conta válida e registrar essa transação.

-   **Requisição**

    Sem parâmetros de rota ou de query  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):
    -   numero_conta
    -   valor

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`mensagem`** que deverá possuir um texto informativo para orientar que o depósito foi realizado com sucesso.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Validar os campos obrigatórios:
        -   numero_conta
        -   valor
    -   Verificar se o valor atribuído a propriedade **`numero_conta`** informada no corpo da requisição pertence a alguma conta
    -   Verificar se o valor atribuído a propriedade **`valor`** informada no corpo da requisição é negativo ou está zerado, pois, não serão permitidos depósitos com valores negativos ou zerados
    -   Somar o valor de depósito ao saldo da conta encontrada

#### **Exemplo de requisição**

```javascript
// POST /transacoes/depositar
{
    "numero_conta": "1",
    "valor": 10000
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// sucesso ao depositar
{
    mensagem: "Depósito realizado com sucesso"
}

// HTTP Status 400, 404
// erro ao depositar
{
    mensagem: "Mensagem de erro"
}
```

#### **Exemplo do registro de um depósito**

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta: "1",
    valor: 10000
}
```

### **Sacar**

#### `POST` `/transacoes/sacar`

Essa é a rota que será utilizada para realizar o saque de um valor em uma determinada conta bancária e registrar essa transação.

-   **Requisição**

    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):
    -   numero_conta
    -   valor
    -   senha

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`mensagem`** que deverá possuir um texto informativo para orientar que o saque foi realizado com sucesso.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Validar os campos obrigatórios:
        -   numero_conta
        -   valor
        -   senha
    -   Verificar se o valor atribuído a propriedade **`numero_conta`** informada no corpo da requisição pertence a alguma conta
    -   Verificar se o valor atribuído a propriedade **`senha`** informada no corpo da requisição é uma senha válida para a conta informada
    -   Verificar se o valor atribuído a propriedade **`valor`** informada no corpo da requisição é maior do que o saldo em conta, pois, não serão permitidos saques com valores superiores ao saldo em conta 
    -   Subtrair o valor sacado do saldo da conta encontrada

#### **Exemplo de requisição**

```javascript
// POST /transacoes/sacar
{
    "numero_conta": "1",
    "valor": 10000,
    "senha": "1234"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// sucesso ao sacar
{
    mensagem: "Saque realizado com sucesso"
}

// HTTP Status 400, 404
// erro ao sacar
{
    mensagem: "Mensagem de erro"
}
```

#### **Exemplo do registro de um saque**

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta: "1",
    valor: 10000
}
```

### **Transferir**

#### `POST` `/transacoes/transferir`

Essa é a rota que será utilizada para  para realizar a transferência de saldo de uma conta bancária para outra e registrar essa transação.

-   **Requisição**

    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):
    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`mensagem`** que deverá possuir um texto informativo para orientar que a t ransferência foi realizada com sucesso.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Validar os campos obrigatórios:
        -   numero_conta_origem
        -   numero_conta_destino
        -   valor
        -   senha
    -   Verificar se o valor atribuído a propriedade **`numero_conta_origem`** informada no corpo da requisição pertence a alguma conta
    -   Verificar se o valor atribuído a propriedade **`numero_conta_destino`** informada no corpo da requisição pertence a alguma conta
    -   Verificar se o valor atribuído a propriedade **`senha`** informada no corpo da requisição é uma senha válida para a **conta de origem** informada
    -   Verificar se o valor atribuído a propriedade **`valor`** informada no corpo da requisição é maior do que o saldo existente na **conta de origem**, pois, não serão permitidas transferências com valores superiores ao saldo em conta 
    -   Subtrair o valor da transfência do saldo na conta de origem
    -   Somar o valor da transferência no saldo da conta de destino

#### **Exemplo de requisição**

```javascript
// POST /transacoes/transferir
{
    "numero_conta_origem": "1",
    "numero_conta_destino": "1",
    "valor": 10000,
    "senha": "1234"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// sucesso ao transferir
{
    mensagem: "Transferência realizado com sucesso"
}

// HTTP Status 400, 404
// erro ao transferir
{
    mensagem: "Mensagem de erro"
}
```

#### **Exemplo do registro de uma transferência**

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta_origem: "1",
    numero_conta_destino: "2",
    valor: 10000
}
```

### **Consultar Saldo**

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Essa é a rota que será utilizada para retornar o saldo de uma conta bancária.

-   **Requisição**  

    Parâmetros do tipo query:
    -   numero_conta.  
    -   senha.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`saldo`** que deverá possuir o saldo em conta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Verificar se os parâmetros de query **`numero_conta`** e **`senha`** foram informados na requisição
    -   Verificar se o valor atribuído a propriedade **`numero_conta`** informada através de parâmetro de query pertence a alguma conta
    -   Verificar se o valor atribuído a propriedade **`senha`** informada através de parâmetro de query é uma senha válida para a conta informada
    -   Exibir o saldo da conta bancária em questão

#### **Exemplo de requisição**

```javascript
// GET /contas/saldo?numero_conta=numero-da-conta&senha=senha-da-conta
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201
// sucesso ao obter saldo
{
    saldo: 10000
}

// HTTP Status 400, 404
// erro ao obter saldo
{
    mensagem: "Mensagem de erro"
}
```

### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Essa é a rota que será utilizada para  listar as transações realizadas de uma conta específica.

-   **Requisição**  

    Parâmetros do tipo query:
    -   numero_conta.  
    -   senha.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  

    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **`saques`** que deverá possuir todos os saques vinculados a conta, a propriedade **`depositos`** que deverá possuir todos os depósitos vinculados a conta, a propriedade **`transferenciasEnviadas`** que deverá possuir todas as transferências enviadas desta conta e a propriedade **`transferenciasRecebidas`** que deverá possuir todas as transferências recebidas nesta conta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **`mensagem`** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Verificar se os parâmetros de query **`numero_conta`** e **`senha`** foram informados na requisição
    -   Verificar se o valor atribuído a propriedade **`numero_conta`** informada através de parâmetro de query pertence a alguma conta
    -   Verificar se o valor atribuído a propriedade **`senha`** informada através de parâmetro de query é uma senha válida para a conta informada
    -   Retornar a lista de saques, depósitos, transferências enviadas e transferências recebidas da conta em questão.

#### **Exemplo de requisição**

```javascript
// GET /contas/extrato?numero_conta=numero-da-conta&senha=senha-da-conta
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
// sucesso ao obter extrato
{
  depositos: [
    {
      data: "2021-08-18 20:46:03",
      numero_conta: "1",
      valor: 10000
    },
    {
      data: "2021-08-18 20:46:06",
      numero_conta: "1",
      valor: 10000
    }
  ],
  saques: [
    {
      data: "2021-08-18 20:46:18",
      numero_conta: "1",
      valor: 1000
    }
  ],
  transferenciasEnviadas: [
    {
      data: "2021-08-18 20:47:10",
      numero_conta_origem: "1",
      numero_conta_destino: "2",
      valor: 5000
    }
  ],
  transferenciasRecebidas: [
    {
      data: "2021-08-18 20:47:24",
      numero_conta_origem: "2",
      numero_conta_destino: "1",
      valor: 2000
    },
    {
      data: "2021-08-18 20:47:26",
      numero_conta_origem: "2",
      numero_conta_destino: "1",
      valor: 2000
    }
  ]
}

// HTTP Status 400, 404
// erro ao obter extrato
{
    mensagem: 'Mensagem do erro!'
}
```

## Aulas úteis:

-   [Rotas, Intermediários e Controladores](https://aulas.cubos.academy/turma/7d1513ce-ce03-495f-8b7d-c3aef1522063/aulas/f876e20a-5661-4527-8162-5ecd0da5672c)
-   [Aula API REST](https://aulas.cubos.academy/turma/7d1513ce-ce03-495f-8b7d-c3aef1522063/aulas/d09cc687-abc4-494b-9a56-d7697b5e4d0e)
-   [Formatando datas com date-fns](https://aulas.cubos.academy/turma/7d1513ce-ce03-495f-8b7d-c3aef1522063/aulas/b8198f42-34c5-4c81-a936-6d8aff4d50ce)
-   [Aula objetos](https://aulas.cubos.academy/turma/7d1513ce-ce03-495f-8b7d-c3aef1522063/aulas/6cc31181-71b7-4cea-bf60-3f7a0b64ad86)
-   [Aula funções](https://aulas.cubos.academy/turma/7d1513ce-ce03-495f-8b7d-c3aef1522063/aulas/861b1778-bb3a-4f69-858e-14ee896854c5)
-   [Aula de Revisão](https://aulas.cubos.academy/turma/7d1513ce-ce03-495f-8b7d-c3aef1522063/aulas/7b06e71c-6f34-43dd-a985-1935192ac960)

**LEMBRE-SE**: é melhor feito do que perfeito!!!

###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`
