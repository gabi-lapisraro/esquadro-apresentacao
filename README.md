# ESQUADЯO — apresentação

A apresentação de pitch do plugin ESQUADЯO, em três formatos: página web,
PDF e PPTX. Antes vivia dentro do repositório do plugin
([`esquadro-photoshop`](https://github.com/gabi-lapisraro/esquadro-photoshop)) —
saiu de lá porque não é engenharia do plugin, é material de conversa interna.

**`docs/apresentacao.html` é a fonte.** PDF e PPTX são traduções dele, feitas
por script, não conversão automática — quando o conteúdo do HTML mudar, o
texto dos dois scripts abaixo precisa acompanhar à mão. São formatos com
ritmos diferentes (coluna contínua vs. página com margem) e não vale a pena
amarrar um no outro.

## Gerar

```bash
python3 gerar-pdf.py              # sai em docs/ESQUADRO-apresentacao.pdf
cd docs && npm install && node gerar-pptx.js   # sai em docs/ESQUADRO-apresentacao.pptx
```

Os dois exigem estar rodando **num Mac com o Google Chrome e as fontes da
marca instaladas** (`~/Library/Fonts`) — nenhum dos dois busca fonte
remota, porque o PDF sai errado se buscar (ver o cabeçalho de `gerar-pdf.py`).
A imagem `docs/assets/painel.png` é capturada do `playground.html` do
repositório do plugin, a 3×, e recortada na coluna do painel.

Os `.pdf`/`.pptx` gerados **não são versionados** — são o produto de rodar os
scripts acima, e binário em git não tem diff: cada regeração gravaria uma
cópia inteira nova no histórico. Compartilhe o arquivo já pronto pelo Slack,
Drive, ou anexado a uma *release* deste repositório.

## Página publicada

O `docs/apresentacao.html` também é a fonte de um artifact já publicado. Para
atualizá-lo, republique **o mesmo caminho de arquivo** no Claude, ou passe a
URL existente — senão vira um artifact novo.

## Licença

Copyright © 2026 **LAPISRARO**. Todos os direitos reservados — ver
[`LICENSE`](LICENSE). Autoria: Gabriella Felisberto, para a LAPISRARO.
