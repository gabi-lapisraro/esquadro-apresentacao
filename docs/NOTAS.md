# Notas de geração

Migrado do `docs/ESTADO.md` do `esquadro-photoshop` em 26/08/2026, quando este
material saiu daquele repositório.

## PPTX

```bash
cd docs && npm install && node gerar-pptx.js
```

13 slides, mesma paleta e mesma tipografia do documento online. O
`gerar-pptx.js` é a tradução, não uma conversão: HTML não vira slide sozinho —
o documento é uma coluna contínua, o slide é uma página com margem. Quando o
conteúdo do `apresentacao.html` mudar, o texto do script precisa acompanhar à
mão. São dois formatos com ritmos diferentes e não vale amarrar um no outro.

A imagem do painel é `docs/assets/painel.png`, capturada do `playground.html`
do repositório do plugin a 3× e recortada na coluna do painel.

**Não deu para conferir com o olho.** A máquina onde isto foi gerado não tinha
PowerPoint, Keynote nem LibreOffice, então não houve como renderizar os slides
em imagem. O que foi conferido: o texto está na ordem em todos os 13, e uma
auditoria de geometria lida do XML não achou caixa fora do slide nem margem
apertada. **O que falta é o olho de quem for revisar** — se algum texto
estourar a caixa, é aí.

## PDF

```bash
python3 gerar-pdf.py     # sai em docs/ESQUADRO-apresentacao.pdf
```

Para editar no Illustrator e remontar no Google Docs. Duas coisas quebram esse
PDF, e as duas em silêncio:

- **As fontes.** O `apresentacao.html` busca o Plex do Google Fonts, que é o
  certo para a página publicada. Mas o Chrome headless sem rede não busca
  nada, e o PDF sai **todo em Menlo**. O script gera uma CÓPIA do HTML com as
  fontes em data URI, lidas de `~/Library/Fonts`, e deixa o arquivo original
  intocado. A dica `format('truetype')` é necessária — sem ela o Chrome
  recusa.
- **A cor de fundo.** O navegador a descarta ao imprimir. É o que o bloco
  `@media print` do `apresentacao.html` resolve: liga `print-color-adjust:
  exact`, força o tema claro (fundo escuro em papel gasta tinta e some no
  Illustrator) e impede seção cortada no meio da página, o que importa para
  quem vai remontar.

O script confere o resultado e **avisa se sobrou Menlo**, que é o sintoma de
fonte que não embarcou. Uma sobra é conhecida e decidida: o `Milo`.

**O `Milo` nunca funcionou, nem na web.** O CSS pede a família `'Milo'`, e a
instalada chama **`Milo OT`** — nome diferente, então o corpo do texto sempre
caiu no Plex. Não foi corrigido a pedido da autora ("não precisa de
preciosismo com a fonte"), e fica anotado porque é de uma linha: trocar o nome
no `--sans` do `apresentacao.html`.

## Página publicada

Publicada e privada: <https://claude.ai/code/artifact/671e604f-cfb2-4a21-896a-f2e8473bb4c2>

Para atualizar, republicar **o mesmo caminho de arquivo** (`docs/apresentacao.html`)
ou passar a URL acima — senão vira um artifact novo. Está privada;
compartilhar pelo menu da própria página.

Contraste corrigido para WCAG AA nos dois temas, verificado par por par.
`--accent` (texto) e `--accent-surface` (fundo) são separados de propósito: o
acento clareia no tema escuro para ser legível como texto, mas como
superfície clareado reprovava com texto branco.
