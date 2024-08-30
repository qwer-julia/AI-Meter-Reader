# AI-Meter-Reader
## Objetivo
O AI-Meter-Reader é um serviço de back-end para gerenciar a leitura individualizada de consumo de água e gás. Utilizando inteligência artificial (IA), o serviço obtém medições a partir de fotos de medidores.

## Instalação e Configuração
O projeto utiliza Docker para facilitar a execução. Siga os passos abaixo para configurar o ambiente local:

### Clone o repositório:



git clone https://github.com/qwer-julia/AI-Meter-Reader.git
cd AI-Meter-Reader
### Construa a imagem Docker e inicie o container:



docker-compose build
docker-compose up
## Endpoints da API
### POST /upload
Recebe uma imagem em base64, consulta o Gemini e retorna a medida lida pela API.

Request Body:



{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "datetime",
  "measure_type": "WATER" ou "GAS"
}
Response Body:

200 OK



{
  "image_url": "string",
  "measure_value": integer,
  "measure_uuid": "string"
}
400 Bad Request



{
  "error_code": "INVALID_DATA",
  "error_description": "<descrição do erro>"
}
409 Conflict



{
  "error_code": "DOUBLE_REPORT",
  "error_description": "Leitura do mês já realizada"
}
### PATCH /confirm
Confirma ou corrige o valor lido pelo LLM.

Request Body:



{
  "measure_uuid": "string",
  "confirmed_value": integer
}
Response Body:

200 OK



{
  "success": true
}
400 Bad Request



{
  "error_code": "INVALID_DATA",
  "error_description": "<descrição do erro>"
}
404 Not Found



{
  "error_code": "MEASURE_NOT_FOUND",
  "error_description": "Leitura não encontrada"
}
409 Conflict



{
  "error_code": "CONFIRMATION_DUPLICATE",
  "error_description": "Leitura já confirmada"
}
### GET /<customer_code>/list
Lista as medidas realizadas por um cliente específico. Opcionalmente, pode filtrar por tipo de medição.

Query Parameters:

measure_type: Tipo de medição ("WATER" ou "GAS"), case insensitive.
Response Body:

200 OK



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
400 Bad Request



{
  "error_code": "INVALID_TYPE",
  "error_description": "Tipo de medição não permitida"
}
404 Not Found



{
  "error_code": "MEASURES_NOT_FOUND",
  "error_description": "Nenhuma leitura encontrada"
}