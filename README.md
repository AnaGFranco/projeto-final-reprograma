# projeto-final-reprograma

Pode ser difícil lembrar o horário prescrito, particularmente quando se tomam vários medicamentos em horários diferentes. O esquecimento dos medicamentos podem causar efeito colateral dependendo da situação do paciente.

**Objetivo deste projeto**  
API terá como objetivo criar o controle de remédios para os paciente, amenizado o esquecimento do consumo dos medicamentos.

**Bibliotecas utilizadas:**

- moment
- bcrytjs
- jsonwebtoken
- express
- mongoose
- dotenv-safe
- cors
- body-parse


**Tecnologia**
- Node JS
- MongoDB

Para rodar os endpoits utilizamos o Postman

**Para a execução do codigo:**

Será necessario clonar este repositório:  
  
 **1º** Acessar o git bash;  
  
 **2º** Digite o comando:  
   
` git clone https://github.com/AnaGFranco/projeto-final-reprograma.git   `

Após clonar, acesse o novo diretório criado e excute a instalação das dependencias com o comando:
  
`   npm install      `
`   npm start      `
`   nodemon app.js      `

**Endpoints**  
  
GET    pacientes/   => lISTA PACIENTES
  
POST   pacientes/  => CRIAR USUARIO COMUM
  
POST   pacientes/admin => CRIAR USUARIO ADMINISTRADOR
  
GET    pacientes/:id   => LISTAR PACIENTE POR ID
  
PATCH  pacientes/:id   => ATUALIZAR PACIENTE POR ID
  
DELETE pacientes/:id   => DELETAR PACIENTE POR ID
  
POST   pacientes/:pacienteId/remedios   => CRIAR REMEDIO POR PACIENTE
  
GET    pacientes/:id/remedios  => LISTAR REMEDIO POR PACIENTE
  
PATCH  pacientes/:pacienteId/remedios/:remedioId  => ATUALIZAR REMEDIO POR PACIENTE
  
GET    pacientes/:pacienteId/remedios/:remedioId  => LISTAR REMEDIO POR ID
  
GET    pacientes/:pacienteId/remediosSemEstoque  => REMEDIOS COM ESTOQUE ZERADO
  
GET    pacientes/:pacienteId/remedios/:remedioId/ProximoConsumo  => LISTAR SE O REMEDIO DEVE DEVE SER CONSUMIDO
  
PATCH  pacientes/:pacienteId/remedios/:remedioId/consumir  => CONSUMIR REMEDIO POR ID
  
DELETE pacientes/:pacienteId/remedios/:remedioId    => DELETAR REMEDIO POR PACIENTE
  
POST   pacientes/login => REALIZAR LOGIN
