# AI-Meter-Reader

## Objetivo

O **AI-Meter-Reader** é um serviço de back-end para gerenciar a leitura individualizada de consumo de água e gás. Utilizando inteligência artificial (IA), o serviço obtém medições a partir de fotos de medidores.

## Instalação e Configuração

O projeto utiliza Docker para facilitar a execução. Siga os passos abaixo para configurar o ambiente local:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/qwer-julia/AI-Meter-Reader.git
   cd AI-Meter-Reader
   ```

2. **Construa a imagem Docker e inicie o container:**

   ```bash
   docker-compose build
   docker-compose up
   ```

## Endpoints da API

### POST /upload

Recebe uma imagem em base64, consulta o Gemini e retorna a medida lida pela API.

**Request Body:**

```json
{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "datetime",
  "measure_type": "WATER" ou "GAS"
}
```

**Response Body:**

- **200 OK**

  ```json
  {
    "image_url": "string",
    "measure_value": integer,
    "measure_uuid": "string"
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error_code": "INVALID_DATA",
    "error_description": "<descrição do erro>"
  }
  ```

- **409 Conflict**

  ```json
  {
    "error_code": "DOUBLE_REPORT",
    "error_description": "Leitura do mês já realizada"
  }
  ```

### PATCH /confirm

Confirma ou corrige o valor lido pelo LLM.

**Request Body:**

```json
{
  "measure_uuid": "string",
  "confirmed_value": integer
}
```

**Response Body:**

- **200 OK**

  ```json
  {
    "success": true
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error_code": "INVALID_DATA",
    "error_description": "<descrição do erro>"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error_code": "MEASURE_NOT_FOUND",
    "error_description": "Leitura não encontrada"
  }
  ```

- **409 Conflict**

  ```json
  {
    "error_code": "CONFIRMATION_DUPLICATE",
    "error_description": "Leitura já confirmada"
  }
  ```

### GET /<customer_code>/list

Lista as medidas realizadas por um cliente específico. Opcionalmente, pode filtrar por tipo de medição.

**Query Parameters:**

- `measure_type`: Tipo de medição ("WATER" ou "GAS"), case insensitive.

**Response Body:**

- **200 OK**

  ```json
  {
    "customer_code": "string",
    "measures": [
      {
        "measure_uuid": "string",
        "measure_datetime": "datetime",
        "measure_type": "string",
        "has_confirmed": boolean,
        "image_url": "string"
      }
    ]
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error_code": "INVALID_TYPE",
    "error_description": "Tipo de medição não permitida"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error_code": "MEASURES_NOT_FOUND",
    "error_description": "Nenhuma leitura encontrada"
  }
  ```

## Exemplo de Imagens em Base64

Na raiz do projeto, há uma pasta chamada `imagens` contendo dois arquivos de texto. Ambos os arquivos possuem uma imagem em base64 que foi utilizada como exemplo para testes.

## Testes Automatizados

Para garantir a confiabilidade dos endpoints, foram implementados testes automatizados utilizando o framework Jest. Os testes cobrem os seguintes cenários:

- **POST /upload:**
  - Validação dos parâmetros enviados, incluindo o formato da imagem em base64.
  - Verificação se já existe uma leitura registrada para o mês atual.
  - Integração com a API LLM para extrair o valor da imagem e verificar se a resposta está correta.

- **PATCH /confirm:**
  - Verificação da existência do código de leitura.
  - Confirmação ou correção do valor lido pela LLM.
  - Validação se o código de leitura já foi confirmado anteriormente.

- **GET /<customer_code>/list:**
  - Testes para listar todas as medições realizadas por um cliente.
  - Verificação do filtro opcional por tipo de medição (`measure_type`).
  - Testes para cenários onde nenhum registro é encontrado.

### Execução dos Testes

Para executar os testes, utilize os seguintes comandos na raiz do projeto:

```bash
cd app
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npm test
```