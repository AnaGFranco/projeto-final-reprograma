# projeto-final-reprograma

Pode ser difícil lembrar o horário prescrito, particularmente quando se tomam vários medicamentos em horários diferentes. O esquecimento dos medicamentos podem causar efeito colateral dependendo da situação do paciente.

**Objetivo deste projeto**
API terá como objetivo criar o controle de remédios para os paciente, amenizado o esquecimento do consumo dos medicamentos.

**Bibliotecas utilizadas: **

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
   
` git clone https://github.com/AnaGFranco/reprograma-projetopratico-backend.git   `

Após clonar, acesse o novo diretório criado e excute a instalação das dependencias com o comando:
  
`   npm install      `
`   npm start      `
`   nodemon app.js      `

**Endpoints**
GET    pacientes/ 
POST   pacientes/  
POST   pacientes/admin  
GET    pacientes/:id   
PATCH  pacientes/:id   
DELETE pacientes/:id 
POST   pacientes/:pacienteId/remedios 
GET    pacientes/:id/remedios
PATCH  pacientes/:pacienteId/remedios/:remedioId  
GET    pacientes/:pacienteId/remedios/:remedioId  
GET    pacientes/:pacienteId/remediosSemEstoque  
GET    pacientes/:pacienteId/remedios/:remedioId/ProximoConsumo  
PATCH  pacientes/:pacienteId/remedios/:remedioId/consumir  
DELETE pacientes/:pacienteId/remedios/:remedioId  
POST   pacientes/login
