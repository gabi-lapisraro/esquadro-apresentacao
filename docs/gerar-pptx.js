// Gera a apresentação do ESQUADЯO em PPTX, com a mesma identidade do documento
// online: fundo Nude Raro, acento Vermelho Raro, títulos em IBM Plex Mono.
//
//     cd docs && npm install pptxgenjs && node gerar-pptx.js
//
// Sai em docs/ESQUADRO-apresentacao.pptx.
//
// POR QUE ISTO EXISTE, e não um "salvar como pptx"
// -----------------------------------------------
// O apresentacao.html é a fonte do conteúdo, mas HTML não vira slide: o
// documento é uma coluna contínua e o slide é uma página com margem. Este script
// é a tradução — mesma paleta, mesma tipografia, mesmo texto, em 13 páginas.
//
// Quando o conteúdo do apresentacao.html mudar, o texto aqui precisa acompanhar.
// Não há geração automática de um para o outro, e não vale a pena: são dois
// formatos com ritmos diferentes.
//
// AS FONTES são as instaladas na máquina dela — IBM Plex Mono e Milo OT. O nome
// da fonte que vai no arquivo é resolvido pelo PowerPoint de quem abre, não por
// aqui: em máquina sem elas, substitui.
//
// A IMAGEM do painel é docs/assets/painel.png, capturada do playground.html a 3x.
// Para refazer: abrir o playground no Chrome headless com --screenshot e recortar
// a coluna do painel (28px de margem, 264 de largura, 520 de altura).
const pptxgen = require('pptxgenjs');
const fs = require('fs');

const AQUI = __dirname;
const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';               // 13,3 x 7,5 pol
p.author = 'LapisRaяo · Brand Intelligence';
p.title = 'ESQUADЯO';

// ---- paleta, a mesma do documento -------------------------------------------
const NUDE = 'E5E3D9', NOIR = '222222', VERM = 'E61C00', BRANCO = 'FFFFFF';
const SOFT = '5A5751', FAINT = '656158', LINHA = 'CFCCC2';

// Plex Mono está instalado na máquina dela e carrega o desenho todo.
// Milo OT é a sans da marca, também instalada.
const MONO = 'IBM Plex Mono', SANS = 'Milo OT';

const M = 0.75;                          // margem
const L = 13.33 - M * 2;                 // largura útil

function slide(fundo) {
  const s = p.addSlide();
  s.background = { color: fundo || NUDE };
  return s;
}

// olho-mágico: o rótulo miúdo em versalete que abre cada seção
function olho(s, txt, y, cor) {
  s.addText(txt.toUpperCase(), {
    isTextBox: true, x: M, y: y || 0.5, w: L, h: 0.28, margin: 0,
    fontFace: MONO, fontSize: 11, bold: true, charSpacing: 2,
    color: cor || VERM,
  });
}

function titulo(s, txt, y) {
  s.addText(txt, {
    isTextBox: true, x: M, y: y || 0.95, w: L, h: 0.85, margin: 0,
    fontFace: MONO, fontSize: 30, bold: true, color: NOIR,
  });
}

function corpo(s, txt, o) {
  s.addText(txt, Object.assign({
    isTextBox: true, x: M, w: L * 0.62, margin: 0,
    fontFace: SANS, fontSize: 15, color: NOIR, lineSpacingMultiple: 1.35,
  }, o));
}

// ============================================================ 1. capa
{
  const s = slide(NOIR);
  s.addText('LAPISRAЯO  ·  BRAND INTELLIGENCE', {
    isTextBox: true, x: M, y: 0.7, w: L, h: 0.3, margin: 0,
    fontFace: MONO, fontSize: 11, bold: true, charSpacing: 2, color: '918D84',
  });
  s.addText('ESQUADЯO', {
    isTextBox: true, x: M, y: 1.35, w: L, h: 1.9, margin: 0,
    fontFace: MONO, fontSize: 96, bold: true, color: 'FF3D22',
  });
  s.addText('O Guia de Formatos deixou de ser consulta.\nVirou ferramenta.', {
    isTextBox: true, x: M, y: 3.5, w: 7.2, h: 1.2, margin: 0,
    fontFace: SANS, fontSize: 22, color: NUDE, lineSpacingMultiple: 1.3,
  });
  s.addShape(p.ShapeType.line, {
    x: M, y: 5.6, w: L, h: 0, line: { color: '4A4A48', width: 1 },
  });
  s.addText('PLUGIN ADOBE PHOTOSHOP     VERSÃO 1.0.0     26 · 08 · 2026', {
    isTextBox: true, x: M, y: 5.75, w: L, h: 0.3, margin: 0,
    fontFace: MONO, fontSize: 11, bold: true, charSpacing: 1.5, color: '918D84',
  });
  s.addNotes('Plugin de pranchetas e guias para Photoshop, feito sobre o Guia de Formatos Digitais 2026.');
}

// ============================================================ 2. o que é
{
  const s = slide();
  olho(s, 'O que é');
  titulo(s, 'Um painel dentro do Photoshop');
  corpo(s, 'Você escolhe a rede, o formato e quantas peças quer. Ele cria as pranchetas com as guias já no lugar certo.',
        { y: 2.0, w: 5.9 });
  corpo(s, 'A medida não é digitada: vem da planilha. É isso que tira o erro da mão de quem cria.',
        { y: 3.1, w: 5.9, color: SOFT });
  s.addImage({ path: AQUI + '/assets/painel.png', x: 8.1, y: 0.75, h: 6.0, w: 3.05,
               rounding: false });
  s.addNotes('O painel real, na cor de tema Vermelho Raro. As quatro cores no rodapé trocam o tema.');
}

// ============================================================ 3. o problema
{
  const s = slide();
  olho(s, 'O problema que ele resolve');
  titulo(s, 'O erro que ninguém vê');
  corpo(s, 'Hoje toda peça começa do zero. Abrir documento, digitar dimensão, calcular margem, arrastar guia por guia.',
        { y: 2.0, w: 5.6 });
  const c = s.addText(
    [{ text: 'Uma guia 20 px fora passa na aprovação interna sem levantar suspeita.', options: { breakLine: true, bold: true } },
     { text: 'E aparece com o texto cortado no feed do cliente.', options: {} }],
    { isTextBox: true, x: 7.0, y: 1.95, w: 5.55, h: 1.8,
      fill: { color: VERM }, color: BRANCO, fontFace: SANS, fontSize: 17,
      lineSpacingMultiple: 1.3, margin: 22, shape: p.ShapeType.roundRect, rectRadius: 0.18 });
  corpo(s, 'O pior não é o tempo perdido. É o que passa.', { y: 3.6, w: 5.6, color: SOFT });
  s.addNotes('O custo real não é o minuto de trabalho, é o retrabalho depois do cliente ver.');
}

// ============================================================ 4. em números
{
  const s = slide();
  olho(s, 'Em números');
  titulo(s, 'A base que sustenta');
  const nums = [['69','formatos prontos'],['11','plataformas'],['1','fonte de dados'],['0','divergências']];
  nums.forEach(([n, rot], i) => {
    const x = M + i * ((L + 0.25) / 4);
    const w = (L + 0.25) / 4 - 0.25;
    s.addShape(p.ShapeType.roundRect, { x, y: 2.15, w, h: 1.85, fill: { color: BRANCO },
      line: { color: LINHA, width: 1 }, rectRadius: 0.14 });
    s.addText(n, { isTextBox: true, x, y: 2.4, w, h: 0.85, margin: 0, align: 'center',
      fontFace: MONO, fontSize: 52, bold: true, color: VERM });
    s.addText(rot.toUpperCase(), { isTextBox: true, x, y: 3.3, w, h: 0.5, margin: 0, align: 'center',
      fontFace: MONO, fontSize: 10, bold: true, charSpacing: 1.2, color: SOFT });
  });
  corpo(s, 'São as peças que o Guia de Formatos manda para o Photoshop, das 98 da base. Cada dimensão e cada margem foram conferidas contra a planilha, uma por uma.',
        { y: 4.4, w: L, color: SOFT, fontSize: 14 });
  s.addNotes('Zero divergência é o número que importa: a base do plugin e a planilha dizem a mesma coisa.');
}

// ============================================================ 5. como funciona
{
  const s = slide();
  olho(s, 'Como funciona');
  titulo(s, 'Quatro passos');
  const passos = [
    'Escolha a plataforma.',
    'Alterne entre Orgânico e Anúncio. A lista de formatos muda com você.',
    'Escolha o formato e quantas pranchetas.',
    'Criar Prancheta. O arquivo nasce nomeado, com as pranchetas lado a lado e as guias em cada uma.',
  ];
  passos.forEach((t, i) => {
    const y = 2.0 + i * 0.72;
    s.addText(String(i + 1).padStart(2, '0'), { isTextBox: true, x: M, y, w: 0.6, h: 0.4, margin: 0,
      fontFace: MONO, fontSize: 13, bold: true, color: VERM });
    s.addText(t, { isTextBox: true, x: M + 0.6, y: y - 0.03, w: 7.6, h: 0.62, margin: 0,
      fontFace: SANS, fontSize: 15, color: NOIR, lineSpacingMultiple: 1.25 });
    s.addShape(p.ShapeType.line, { x: M, y: y + 0.58, w: 8.2, h: 0, line: { color: LINHA, width: 1 } });
  });
  s.addText([
    { text: 'Duas regras que ele aplica sozinho\n', options: { bold: true, breakLine: true } },
    { text: 'A área segura vai em todas as pranchetas. A linha de corte, só na primeira — ela serve para conferir o enquadramento uma vez.\n\n', options: { breakLine: true } },
    { text: 'Formato que é peça única, como o Retrato de anúncio no Meta, não deixa pedir mais de uma.', options: {} },
  ], { isTextBox: true, x: 9.3, y: 1.95, w: 3.28, h: 3.1, fill: { color: BRANCO },
       line: { color: LINHA, width: 1 }, shape: p.ShapeType.roundRect, rectRadius: 0.14,
       fontFace: SANS, fontSize: 12.5, color: NOIR, margin: 18, lineSpacingMultiple: 1.25 });
  corpo(s, 'Tem também Aplicar Guias, para quando o arquivo já está aberto.', { y: 5.0, w: 8.2, color: SOFT, fontSize: 14 });
  s.addNotes('O Aplicar Guias é livre: desenha tudo na prancheta selecionada, sem a restrição do corte.');
}

// ============================================================ 6. como um plugin funciona
{
  const s = slide();
  olho(s, 'Como um plugin funciona');
  titulo(s, 'É uma página de site que roda dentro do Photoshop');
  corpo(s, 'As mesmas três linguagens de qualquer site. O que muda é que o JavaScript, além de mexer na tela, sabe conversar com o Photoshop: pedir um documento, uma prancheta, uma guia em tal coordenada.',
        { y: 2.15, w: L, fontSize: 15 });
  const cards = [
    ['É uma pasta, não um programa', 'Sete arquivos e as fontes. Um deles, o manifest, é a etiqueta: diz o nome, a versão, e que isso é um painel de Photoshop.'],
    ['Não passa por compilação', 'Não existe "gerar o programa". Editar um arquivo de texto e reiniciar o Photoshop já é publicar uma versão nova.'],
    ['O ciclo é curto', 'Mexer, empacotar, reiniciar, olhar. Cada rodada leva um minuto — e é por isso que ver no painel vale mais que simular.'],
  ];
  cards.forEach(([h, t], i) => {
    const w = (L - 0.5) / 3, x = M + i * (w + 0.25);
    s.addShape(p.ShapeType.roundRect, { x, y: 3.35, w, h: 2.2, fill: { color: BRANCO },
      line: { color: LINHA, width: 1 }, rectRadius: 0.14 });
    s.addText(h, { isTextBox: true, x: x + 0.28, y: 3.6, w: w - 0.56, h: 0.6, margin: 0,
      fontFace: MONO, fontSize: 13, bold: true, color: NOIR });
    s.addText(t, { isTextBox: true, x: x + 0.28, y: 4.2, w: w - 0.56, h: 1.2, margin: 0,
      fontFace: SANS, fontSize: 12.5, color: SOFT, lineSpacingMultiple: 1.25 });
  });
  corpo(s, 'O incômodo: o motor do Photoshop entende menos desse HTML e CSS que um navegador, e o que não entende ele descarta calado.',
        { y: 5.85, w: L, color: SOFT, fontSize: 13.5 });
  s.addNotes('Isso é o que faz um plugin de Photoshop ser barato de mexer e caro de testar.');
}

// ============================================================ 7. a planilha
{
  const s = slide();
  olho(s, 'A planilha é a base, não uma cópia');
  titulo(s, 'O plugin não tem medida escrita dentro dele');
  corpo(s, 'Toda dimensão e toda margem vêm do Guia de Formatos Digitais. A planilha é a fonte, e o plugin é uma leitora dela. É isso que faz a correção valer para todo mundo.',
        { y: 2.1, w: 6.2, fontSize: 15 });
  ['A planilha, na aba Formatos. É onde se escreve.',
   'Um conversor lê a planilha e escreve um arquivo de dados.',
   'O plugin carrega esse arquivo ao abrir.'].forEach((t, i) => {
    const y = 3.5 + i * 0.62;
    s.addText(String(i + 1).padStart(2, '0'), { isTextBox: true, x: M, y, w: 0.55, h: 0.35, margin: 0,
      fontFace: MONO, fontSize: 12, bold: true, color: VERM });
    s.addText(t, { isTextBox: true, x: M + 0.55, y: y - 0.03, w: 5.6, h: 0.5, margin: 0,
      fontFace: SANS, fontSize: 14, color: NOIR });
  });
  s.addText([
    { text: 'Dá para automatizar — e é o próximo passo\n\n', options: { bold: true, breakLine: true } },
    { text: 'Hoje a conversão ainda não é um botão, e enquanto for assim, editar a planilha não muda o plugin.\n\n', options: { breakLine: true } },
    { text: 'Isso é automatizável, e sem nada de exótico: as regras já estão escritas e conferidas contra as 69 peças. Falta empacotá-las num atalho de duplo clique.\n\n', options: { breakLine: true } },
    { text: 'Aí atualizar passa a ser: mexer na planilha, clicar, reiniciar o Photoshop.', options: { bold: true } },
  ], { isTextBox: true, x: 7.4, y: 1.95, w: 5.18, h: 4.0, fill: { color: VERM },
       shape: p.ShapeType.roundRect, rectRadius: 0.16, color: BRANCO,
       fontFace: SANS, fontSize: 13.5, margin: 24, lineSpacingMultiple: 1.3 });
  s.addNotes('A parte difícil já está feita: as regras de derivação existem e foram validadas. Falta o invólucro.');
}

// ============================================================ 8. nomenclatura
{
  const s = slide();
  olho(s, 'Nomenclatura automática');
  titulo(s, 'Todo arquivo nasce nomeado');
  s.addShape(p.ShapeType.roundRect, { x: M, y: 2.1, w: L, h: 2.5, fill: { color: NOIR }, rectRadius: 0.18 });
  s.addText('#TAЯEFA_IG_FEED_2608', { isTextBox: true, x: M + 0.5, y: 2.5, w: L - 1, h: 0.9, margin: 0,
    fontFace: MONO, fontSize: 40, bold: true, color: NUDE });
  s.addText('Rede, tipo de peça e data — no documento. As pranchetas dentro dele levam só o número: 1, 2, 3.',
    { isTextBox: true, x: M + 0.5, y: 3.5, w: L - 1, h: 0.5, margin: 0,
      fontFace: SANS, fontSize: 14.5, color: 'B8B4AB' });
  corpo(s, 'Repetir o nome inteiro em cada prancheta enchia a paleta de camadas de linha igual — e quem procura uma prancheta procura pela ordem dela.',
        { y: 4.9, w: 8.4, color: SOFT, fontSize: 14 });
  corpo(s, 'Na hora de salvar, troque #TAЯEFA pelo número do RunRunIt.',
        { y: 5.6, w: 8.4, fontSize: 14, bold: true });
  s.addNotes('O Я é o cirílico U+042F. Em nome de arquivo não há CSS para espelhar um R.');
}

// ============================================================ 9. estado hoje
{
  const s = slide();
  olho(s, 'Estado hoje');
  titulo(s, 'O que está pronto, e o que não está');
  const linhas = [
    ['ok', 'Instala e abre no Photoshop 2026, em Plugins › ESQUADЯO › Lápis RAЯO.'],
    ['ok', 'Pranchetas com posição, tamanho e nome corretos.'],
    ['ok', 'Base de dados alinhada à planilha, sem divergência.'],
    ['ok', 'Guias de área segura e de corte, conferidas no painel.'],
    ['ok', 'Interface na identidade da marca, com as quatro cores do tema.'],
    ['wait', 'Instalar numa segunda máquina. Aqui funciona; "funciona aqui" não é "instala no computador do colega".'],
    ['wait', 'Levar a planilha ao plugin sem etapa manual.'],
    ['wait', 'Formatos diferentes no mesmo arquivo — em estudo.'],
  ];
  linhas.forEach(([tipo, t], i) => {
    const y = 1.95 + i * 0.56;
    const ok = tipo === 'ok';
    s.addShape(p.ShapeType.roundRect, { x: M, y: y + 0.02, w: 0.95, h: 0.3,
      fill: ok ? { color: VERM } : { color: NUDE },
      line: { color: ok ? VERM : LINHA, width: 1 }, rectRadius: 0.15 });
    s.addText(ok ? 'PRONTO' : 'FALTA', { isTextBox: true, x: M, y: y + 0.02, w: 0.95, h: 0.3,
      margin: 0, align: 'center', fontFace: MONO, fontSize: 8.5, bold: true,
      charSpacing: 0.8, color: ok ? BRANCO : SOFT });
    s.addText(t, { isTextBox: true, x: M + 1.2, y, w: L - 1.2, h: 0.4, margin: 0,
      fontFace: SANS, fontSize: 14, color: ok ? NOIR : SOFT });
  });
  s.addNotes('Os três "falta" são, em ordem: testar noutra máquina, automatizar a planilha, e formatos mistos.');
}

// ============================================================ 10. instalar
{
  const s = slide();
  olho(s, 'Para instalar');
  titulo(s, 'Três passos, nos dois sistemas');
  const passos = [
    ['1. Descompactar', 'O ESQUADRO-1.0.0.zip, de 441 KB. As fontes da marca vão dentro — o Photoshop não busca fonte de fora.'],
    ['2. Copiar a pasta', 'Mac: Finder › Ir para a pasta (⇧⌘G), cole ~/Library/Application Support/Adobe/UXP/Plugins/External/\n\nWindows: Win + R, cole %APPDATA%\\Adobe\\UXP\\Plugins\\External e dê Enter.'],
    ['3. Reiniciar o Photoshop', 'Ele lê a pasta de plugins só ao abrir. Depois o painel aparece em Plugins › ESQUADЯO.'],
  ];
  passos.forEach(([h, t], i) => {
    const w = (L - 0.5) / 3, x = M + i * (w + 0.25);
    s.addShape(p.ShapeType.roundRect, { x, y: 2.05, w, h: 3.15, fill: { color: BRANCO },
      line: { color: LINHA, width: 1 }, rectRadius: 0.14 });
    s.addText(h, { isTextBox: true, x: x + 0.28, y: 2.3, w: w - 0.56, h: 0.4, margin: 0,
      fontFace: MONO, fontSize: 13, bold: true, color: NOIR });
    s.addText(t, { isTextBox: true, x: x + 0.28, y: 2.8, w: w - 0.56, h: 2.2, margin: 0,
      fontFace: SANS, fontSize: 11.5, color: SOFT, lineSpacingMultiple: 1.25 });
  });
  s.addText([
    { text: 'Se a pasta External não existir, crie com esse nome exato. E o que vai para dentro dela é a pasta, não os arquivos soltos. ', options: {} },
    { text: 'O caminho do Windows vem da documentação da Adobe e ainda não foi testado numa máquina de verdade.', options: { bold: true } },
  ], { isTextBox: true, x: M, y: 5.45, w: L, h: 0.8, margin: 0,
       fontFace: SANS, fontSize: 12.5, color: FAINT, lineSpacingMultiple: 1.25 });
  s.addNotes('Precisa de Photoshop 23 ou mais novo. O INSTALAR.md tem os seis modos de falha no Windows.');
}

// ============================================================ 11. não faz
{
  const s = slide();
  olho(s, 'O que ele ainda não faz');
  titulo(s, 'Os limites, ditos de frente');
  const itens = [
    ['Peças impressas', 'Outdoor, abrigo e metrô são CMYK em escala. Trabalho de Illustrator, e ficam de fora de propósito.'],
    ['Documentos muito largos', 'O Photoshop para em 30.000 px. Em formatos grandes o painel avisa quantas pranchetas cabem, em vez de falhar.'],
    ['Limpar guias antigas', 'Reaplicar guias no mesmo arquivo empilha as anteriores. Por ora, limpe antes em Visualizar › Limpar guias.'],
  ];
  itens.forEach(([h, t], i) => {
    const y = 2.15 + i * 1.35;
    s.addText(h, { isTextBox: true, x: M, y, w: 4.0, h: 0.4, margin: 0,
      fontFace: MONO, fontSize: 14, bold: true, color: NOIR });
    s.addText(t, { isTextBox: true, x: M + 4.2, y: y - 0.02, w: L - 4.2, h: 0.9, margin: 0,
      fontFace: SANS, fontSize: 14, color: SOFT, lineSpacingMultiple: 1.3 });
    if (i < 2) s.addShape(p.ShapeType.line, { x: M, y: y + 1.05, w: L, h: 0, line: { color: LINHA, width: 1 } });
  });
  s.addNotes('Dizer o limite antes que alguém descubra sozinho é o que mantém a confiança na ferramenta.');
}

// ============================================================ 12. próximo plugin
{
  const s = slide();
  olho(s, 'Para o próximo plugin da casa');
  titulo(s, 'O que este ciclo ensinou');
  corpo(s, 'O motor do Photoshop entende menos HTML e CSS que um navegador — e o que não entende, descarta calado. Sem erro, sem log.',
        { y: 2.1, w: L, fontSize: 15 });
  const li = [
    ['Testar no painel, cedo', '"Funciona no navegador" não é evidência. Sete coisas passaram no navegador e caíram no Photoshop.'],
    ['Não animar o que é estado', 'Transições não completam. Cor que diz "isto está travado" tem que trocar na hora.'],
    ['Um número que se ajusta sozinho', 'Todo valor que precisa ser reajustado quando outro muda vira bug. Derive do que ele depende.'],
    ['Registrar cada armadilha', 'Sete estão anotadas com sintoma e solução, e um verificador trava o empacotamento se voltarem.'],
  ];
  li.forEach(([h, t], i) => {
    const w = (L - 0.3) / 2, x = M + (i % 2) * (w + 0.3), y = 3.2 + Math.floor(i / 2) * 1.5;
    s.addShape(p.ShapeType.roundRect, { x, y, w, h: 1.25, fill: { color: BRANCO },
      line: { color: LINHA, width: 1 }, rectRadius: 0.13 });
    s.addText(h, { isTextBox: true, x: x + 0.26, y: y + 0.16, w: w - 0.52, h: 0.32, margin: 0,
      fontFace: MONO, fontSize: 12.5, bold: true, color: VERM });
    s.addText(t, { isTextBox: true, x: x + 0.26, y: y + 0.52, w: w - 0.52, h: 0.65, margin: 0,
      fontFace: SANS, fontSize: 12.5, color: NOIR, lineSpacingMultiple: 1.22 });
  });
  s.addNotes('Estes quatro valem para qualquer plugin de UXP, não só para este.');
}

// ============================================================ 13. por que importa
{
  const s = slide(NOIR);
  olho(s, 'Por que isso importa', 0.7, 'FF3D22');
  s.addText('A medida certa deixa de depender\nde quem está executando.', {
    isTextBox: true, x: M, y: 1.5, w: 11.0, h: 2.0, margin: 0,
    fontFace: MONO, fontSize: 34, bold: true, color: NUDE, lineSpacingMultiple: 1.15,
  });
  s.addText('A planilha custou meses de conferência. Enquanto é só documento de consulta, cada pessoa reinterpreta à mão — e o erro volta.', {
    isTextBox: true, x: M, y: 3.85, w: 8.6, h: 0.9, margin: 0,
    fontFace: SANS, fontSize: 16, color: 'B8B4AB', lineSpacingMultiple: 1.35,
  });
  s.addText('Ligada a uma ferramenta, ela passa a valer. Corrigir na planilha corrige para todo mundo.', {
    isTextBox: true, x: M, y: 4.9, w: 8.6, h: 0.9, margin: 0,
    fontFace: SANS, fontSize: 16, bold: true, color: NUDE, lineSpacingMultiple: 1.35,
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 6.35, w: 1.75, h: 0.42, fill: { color: VERM }, rectRadius: 0.06 });
  s.addText('LAPISRAЯO', { isTextBox: true, x: M, y: 6.35, w: 1.75, h: 0.42, margin: 0,
    align: 'center', fontFace: MONO, fontSize: 11, bold: true, charSpacing: 1.2, color: BRANCO });
  s.addText('VIRE O Я', { isTextBox: true, x: 10.9, y: 6.38, w: 1.68, h: 0.36, margin: 0,
    align: 'right', fontFace: MONO, fontSize: 13, bold: true, italic: true,
    charSpacing: 1.5, color: 'FF3D22' });
  s.addNotes('Fecha onde abriu: a planilha só vale se estiver ligada a uma ferramenta.');
}

p.writeFile({ fileName: AQUI + '/ESQUADRO-apresentacao.pptx' }).then(f => console.log('gerado:', f));
