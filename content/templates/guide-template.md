---
title: Título do Guia
subtitle: Uma breve descrição do que será abordado neste guia.
author: seu-nome # Deve corresponder ao ID no data.json
enableTableOfContents: true
updatedOn: '2025-05-17T12:00:00.000Z'
# redirectFrom: ['/guides/old-path/']  # Opcional
# isDraft: true  # Opcional
# ogImage: '/path/to/image.jpg'  # Opcional
---

Uma introdução clara ao assunto do guia, explicando o que será abordado e por que é importante.

## Pré-requisitos

- Item 1
- Item 2
- Item 3

## Configuração Inicial

<CodeTabs labels={["npm", "yarn", "pnpm"]}>

```bash
npm install package-name
```

```bash
yarn add package-name
```

```bash
pnpm add package-name
```

</CodeTabs>

## Demonstração Prática

<Tabs labels={["Interface", "Código"]}>

<TabItem>
Aqui vai o conteúdo da primeira aba, pode incluir imagens ou texto.

![Descrição da imagem](/guides/images/nome-do-arquivo.png)
</TabItem>

<TabItem>
Aqui vai o conteúdo da segunda aba, pode incluir código:

```javascript showLineNumbers
const exemplo = "Hello World";
console.log(exemplo); // [!code highlight]
```
</TabItem>

</Tabs>

## Notas Importantes

<Admonition type="note" title="Lembre-se">
Informação importante que os usuários devem ter em mente.
</Admonition>

<Admonition type="warning">
Alertas sobre possíveis problemas ou considerações importantes.
</Admonition>

## Termos Técnicos

<DefinitionList>

Termo 1
: Primeira definição
: Segunda definição

Termo 2
: Definição única com **formatação** e <br/> quebra de linha

[Termo com Link](/)
: Definição com link para [documentação](/docs)

</DefinitionList>

## Recursos Relacionados

<DetailIconCards>

<a href="/guides/exemplo1" description="Descrição do primeiro recurso" icon="github">Nome do Recurso 1</a>

<a href="/guides/exemplo2" description="Descrição do segundo recurso" icon="github">Nome do Recurso 2</a>

</DetailIconCards>

## Próximos Passos

<CTA title="Explore Mais" description="Continue seu aprendizado com nossos outros guias e recursos." buttonText="Ver Mais Guias" buttonUrl="/guides" />

<NeedHelp/>
