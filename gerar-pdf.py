#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera o PDF da apresentação, para editar no Illustrator e remontar no Google Docs.

    python3 gerar-pdf.py

Sai em docs/ESQUADRO-apresentacao.pdf — e NÃO em dist/, porque o empacotar.sh
apaga o dist inteiro antes de montar o pacote. Um PDF ali dentro dura até o
próximo empacotamento.

POR QUE NÃO É SÓ "IMPRIMIR EM PDF"
----------------------------------
Duas coisas quebram o resultado, e as duas são silenciosas:

1. **As fontes.** O apresentacao.html busca o Plex do Google Fonts, que é o certo
   para a página publicada. Só que o Chrome em modo headless, sem rede, não busca
   nada e o PDF sai TODO em Menlo. Então aqui se gera uma CÓPIA do HTML com as
   fontes embarcadas em data URI, lidas de ~/Library/Fonts. O arquivo original
   fica intocado.

2. **A cor de fundo.** O navegador descarta fundo ao imprimir por padrão. Sem o
   bloco `@media print` do apresentacao.html — que liga `print-color-adjust:
   exact`, força o tema claro e impede seção cortada no meio da página — o PDF
   sai texto preto no branco, sem o nude, sem os cartões e sem as pílulas de
   estado. Ou seja: sem a identidade, que é metade do documento.
"""

import base64
import pathlib
import shutil
import subprocess
import sys
import tempfile

RAIZ = pathlib.Path(__file__).parent
FONTE = RAIZ / "docs" / "apresentacao.html"
SAIDA = RAIZ / "docs" / "ESQUADRO-apresentacao.pdf"
FONTES = pathlib.Path.home() / "Library" / "Fonts"

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

LINK_REMOTO = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
               'family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,700'
               '&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap">')

# Peso por arquivo. O Plex Mono carrega o desenho todo — títulos, rótulos,
# números. A sans da marca é o Milo; a família instalada chama "Milo OT", e o CSS
# pede "Milo", então na web o corpo cai no Plex Sans. Aqui a cópia aponta para o
# arquivo, que é o que o PDF precisa.
MONO = [("IBMPlexMono-Light.ttf", 300), ("IBMPlexMono-Regular.ttf", 400),
        ("IBMPlexMono-Medium.ttf", 500), ("IBMPlexMono-SemiBold.ttf", 600),
        ("IBMPlexMono-Bold.ttf", 700)]
SANS = [("MiloOT-Light.otf", 300), ("MiloOT-Text.otf", 400),
        ("MiloOT-Medi.otf", 500), ("MiloOT-Bold.otf", 600)]


def face(familia, arquivo, peso, estilo="normal"):
    """Um @font-face com a fonte embarcada em data URI."""
    caminho = FONTES / arquivo
    if not caminho.exists():
        print(f"  faltando: {arquivo} — segue sem ela")
        return ""
    otf = arquivo.endswith(".otf")
    b64 = base64.b64encode(caminho.read_bytes()).decode()
    # a dica de formato importa: sem ela o Chrome recusou o OTF
    return (f"@font-face{{font-family:'{familia}';font-weight:{peso};"
            f"font-style:{estilo};src:url('data:font/{'otf' if otf else 'ttf'};"
            f"base64,{b64}') format('{'opentype' if otf else 'truetype'}')}}\n")


def main():
    if not pathlib.Path(CHROME).exists():
        sys.exit(f"Não achei o Chrome em {CHROME}.\n"
                 "Ele é quem imprime. Sem ele, abra o apresentacao.html no "
                 "navegador e use Imprimir → Salvar como PDF: o @media print já "
                 "está lá, só as fontes vão faltar.")
    if not FONTE.exists():
        sys.exit(f"Não achei {FONTE}")

    html = FONTE.read_text(encoding="utf-8")

    faces = "".join(face("IBM Plex Mono", a, p) for a, p in MONO)
    faces += face("IBM Plex Mono", "IBMPlexMono-BoldItalic.ttf", 700, "italic")
    faces += "".join(face("Milo Impressa", a, p) for a, p in SANS)

    if LINK_REMOTO not in html:
        sys.exit("O <link> das fontes mudou no apresentacao.html. "
                 "Atualize LINK_REMOTO aqui, senão o PDF sai em Menlo — e sai "
                 "sem avisar.")
    html = html.replace(LINK_REMOTO, "<style>\n" + faces + "</style>")
    html = html.replace(
        "--sans: 'Milo', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;",
        "--sans: 'Milo Impressa', 'IBM Plex Mono', sans-serif;")

    with tempfile.TemporaryDirectory() as tmp:
        copia = pathlib.Path(tmp) / "para-pdf.html"
        copia.write_text(html, encoding="utf-8")
        subprocess.run(
            [CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
             # tempo para as fontes assentarem antes de imprimir
             "--virtual-time-budget=8000",
             f"--print-to-pdf={SAIDA}", copia.as_uri()],
            check=True, capture_output=True)

    if not SAIDA.exists():
        sys.exit("O Chrome não escreveu o PDF.")

    bruto = SAIDA.read_bytes()
    paginas = bruto.count(b"/Type /Page") - bruto.count(b"/Type /Pages")
    embarcadas = sorted({b.split(b"+")[-1].decode()
                         for b in __import__("re").findall(
                             rb"/BaseFont\s*/([A-Za-z0-9+#\-]+)", bruto)})
    print(f"gerado: {SAIDA.relative_to(RAIZ)}  "
          f"{round(len(bruto)/1024)} KB, {paginas} páginas")
    print("fontes no PDF:", ", ".join(embarcadas))
    if any(f.startswith("Menlo") for f in embarcadas):
        print("  aviso: sobrou Menlo — alguma fonte não embarcou.")


if __name__ == "__main__":
    main()
