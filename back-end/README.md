# Email Assistant API - Guia de Instalação Local

API para classificação de emails (produtivo/improdutivo) e geração automática de respostas usando inteligência artificial.

## Pré-requisitos

- Python 3.12 ou superior
- pip (gerenciador de pacotes Python)

## Passo a Passo

### 1. Navegar para o diretório do back-end

```bash
cd /home/caio/dev/autou/back-end
```

### 2. Criar ambiente virtual (se ainda não tiver)

```bash
python3 -m venv venv
```

### 3. Ativar o ambiente virtual

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 4. Instalar dependências

```bash
pip install -r requirements.txt
```

### 5. Configurar variáveis de ambiente

Crie um arquivo `.env` no diretório `back-end/`:

```bash
touch .env
```

Adicione as seguintes variáveis:

```env
# API Key do Groq (obrigatória)
GROQ_API_KEY=sua_chave_groq_aqui

# Origens permitidas para CORS (opcional - padrão: http://localhost:3000)
ALLOWED_ORIGINS=http://localhost:3000
```

**Para obter a API key do Groq:**
- Acesse: https://console.groq.com/keys
- Crie uma nova API key
- Copie e cole no arquivo `.env`

### 6. Rodar o servidor

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O servidor estará rodando em: `http://localhost:8000`

### 7. Testar a API

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Documentação Interativa:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Comandos Úteis

### Rodar com reload automático (desenvolvimento)
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Rodar em produção
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Executar testes
```bash
pytest tests/ -v
```

### Desativar ambiente virtual
```bash
deactivate
```

## Estrutura de Portas

- **8000**: Porta padrão do servidor
- **3000**: Porta padrão do front-end (Next.js)