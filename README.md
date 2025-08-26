# WhatsApp Connect

Um projeto Next.js para conectar instâncias do WhatsApp através de QR Code, usando a API UAZ.

## 🚀 Funcionalidades

- ✅ Criar múltiplas instâncias do WhatsApp
- ✅ Conectar via QR Code ou código de pareamento
- ✅ Gerenciar status das conexões em tempo real
- ✅ Interface moderna com Shadcn/UI e Tailwind CSS
- ✅ Visualização de QR codes diretamente na interface
- ✅ Auto-refresh de status para instâncias conectando

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm
- Token de admin da API UAZ

## 🛠 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd whatsapp-connect
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e adicione seu token de admin:
```env
WHATSAPP_ADMIN_TOKEN=seu-token-aqui
NEXT_PUBLIC_WHATSAPP_ADMIN_TOKEN=seu-token-aqui

# Node.js SSL Configuration (for development only)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

> ⚠️ **Importante**: A configuração `NODE_TLS_REJECT_UNAUTHORIZED=0` é apenas para desenvolvimento e permite conexões SSL não verificadas.

4. Execute o projeto:
```bash
pnpm dev
```

Acesse as aplicações:

- **Interface do Cliente**: [http://localhost:3000](http://localhost:3000) - Interface simplificada para clientes
- **Interface Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) - Interface completa para administradores

## 🏗 Arquitetura

### Estrutura do Projeto
```
├── app/
│   └── page.tsx                 # Página principal
├── components/
│   ├── ui/                      # Componentes Shadcn/UI
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── label.tsx
│   │   └── features-8.tsx       # Seção de recursos
│   └── whatsapp-connect.tsx     # Componente principal
├── lib/
│   └── whatsapp-api.ts          # Serviço da API
└── .env.local                   # Variáveis de ambiente
```

### API Endpoints Utilizados

- `POST /instance/init` - Criar nova instância
- `POST /instance/connect` - Conectar instância ao WhatsApp
- `GET /instance/status` - Verificar status da instância
- `POST /instance/disconnect` - Desconectar instância
- `DELETE /instance/delete` - Excluir instância

## 🔧 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática  
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones
- **UAZ API** - API para WhatsApp Business

## 📱 Como Usar

### 🎯 Interface do Cliente (Simplificada)

A interface principal foi redesenhada para proporcionar uma experiência simples e direta para os clientes:

1. **Digite o Nome**: Insira um nome personalizado para identificar sua instância
2. **Criar Instância**: Clique no botão "Criar Instância MLT" 
3. **Gerar QR Code**: Após criar a instância, clique em "Gerar QR Code"
4. **Conectar WhatsApp**: Escaneie o QR Code com seu WhatsApp
5. **Confirmação**: Visualize os detalhes da conexão, nome e número conectado

#### Fluxo da Interface do Cliente:
1. **Tela Inicial** → Campo para digitar nome + Botão criar instância
2. **Instância Criada** → Exibe nome escolhido + Botão gerar QR Code  
3. **QR Code Gerado** → QR Code + Status "Aguardando conexão"
4. **Conectado** → Nome, número e status da conexão

### 🔧 Interface Admin (Completa)

Para administradores, acesse `/admin` para ter acesso à interface completa com:

1. **Criando uma Nova Instância**
   - Digite um nome para sua instância
   - Clique em "Create Instance"
   - A instância será criada com status "Disconnected"

2. **Conectando via QR Code**
   - Clique em "Generate QR Code" na instância desejada
   - Um QR Code será exibido na interface
   - Abra o WhatsApp no seu celular
   - Vá em **Configurações > Dispositivos conectados > Conectar dispositivo**
   - Escaneie o QR Code exibido

3. **Monitoramento Avançado**
   - Status das instâncias atualizado automaticamente
   - Instâncias "connecting" verificadas a cada 5 segundos
   - Botão "Refresh" para atualização manual
   - Gerenciamento de múltiplas instâncias

## 🎯 Status das Instâncias

- 🔴 **Disconnected** - Instância criada mas não conectada
- 🟡 **Connecting** - Processo de conexão em andamento (QR Code ativo)  
- 🟢 **Connected** - Conectada e autenticada no WhatsApp

## 🔐 Segurança

- Todas as conexões usam HTTPS
- Tokens são armazenados em variáveis de ambiente
- A API UAZ fornece criptografia end-to-end

## 🐛 Resolução de Problemas

### QR Code não aparece
- Verifique se o token de admin está correto
- Confirme se a instância está no status "connecting"
- Tente recriar a instância

### Instância não conecta
- Verifique sua conexão com internet
- Certifique-se de que o WhatsApp está atualizado
- O QR Code expira em 2 minutos - gere um novo

### Erro de token
- Confirme se `WHATSAPP_ADMIN_TOKEN` está definido em `.env.local`
- Verifique se o token é válido na documentação da API

## 📚 Documentação da API

Para mais detalhes sobre a API UAZ, consulte: [https://docs.uazapi.com/](https://docs.uazapi.com/)

## 🚀 Deploy

Para fazer deploy em produção:

1. **Configure as variáveis de ambiente** no seu provedor de hosting
2. **Remova** `NODE_TLS_REJECT_UNAUTHORIZED=0` em produção
3. **Configure HTTPS** adequadamente
4. **Use um domínio personalizado** para melhor experiência

### Providers Recomendados:
- **Vercel** (Recomendado para Next.js)
- **Netlify**
- **Railway**
- **Heroku**

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido pela **MLT Corp** com foco na melhor experiência de conexão WhatsApp.

---

**Desenvolvido com ❤️ usando Next.js 15, TypeScript, Tailwind CSS e UAZ API**
