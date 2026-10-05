'use strict';

const USUARIOS = [
  { id: 1, nome: 'Administrador', login: 'admin', senha_hash: 'bf6b5bdb74c79ece9fc0ad0ac9fb0359f9555d4f35a83b2e6ec69ae99e09603d' },
  { id: 2, nome: 'Maria Souza',  login: 'maria', senha_hash: '734f68a9fb7bc1918b8d11bd7cc8e31505a771b47e3a9c7cb248291842f6c67f' },
];
const CATEGORIAS = ['Smartphone', 'Notebook', 'Smart TV', 'Acessório'].map((nome, i) => ({ id: i + 1, nome }));

const PRODUTOS = [
  ['Galaxy S24 128GB', 1, '6.2" AMOLED; 128GB; 5G; Bivolt', 4299.9, 5],
  ['iPhone 15 256GB', 1, '6.1" OLED; 256GB; 5G; USB-C', 6499, 4],
  ['Moto G54 256GB', 1, '6.5" LCD 120Hz; 256GB; 5G', 1399, 8],
  ['Notebook Dell Inspiron 15', 2, 'i5 13ª ger.; 16GB RAM; SSD 512GB; 15.6" FHD; 19V', 3899, 3],
  ['Notebook Lenovo IdeaPad 3', 2, 'Ryzen 5; 8GB RAM; SSD 256GB; 15.6" FHD', 2799, 3],
  ['MacBook Air M2', 2, 'M2; 8GB; SSD 256GB; 13.6" Retina', 8999, 2],
  ['Smart TV LG 50" 4K', 3, '50"; 3840x2160; WebOS; 3 HDMI; 110-240V', 2599, 4],
  ['Smart TV Samsung 55" QLED', 3, '55"; 4K QLED; Tizen; Wi-Fi/Bluetooth', 3799, 3],
  ['Smart TV TCL 32" HD', 3, '32"; 1366x768; Google TV', 1099, 5],
  ['Carregador USB-C 65W', 4, '65W; GaN; Bivolt', 149.9, 10],
  ['Fone Bluetooth JBL Tune', 4, 'Bluetooth 5.3; 40h bateria', 249, 10],
  ['Mouse sem fio Logitech', 4, '2.4GHz; 1000dpi', 89.9, 6],
];

const MOVS = [[1,20,12,'Vendas da semana'],[2,10,7,'Vendas'],[3,30,5,'Vendas'],[4,8,2,'Venda corporativa'],
  [5,6,3,'Vendas'],[6,4,3,'Vendas'],[7,12,2,'Vendas'],[8,6,1,'Vendas'],[9,15,4,'Vendas'],
  [10,40,25,'Vendas'],[11,25,8,'Vendas'],[12,3,1,'Venda']];

function dadosIniciais() {
  const produtos = PRODUTOS.map((p, i) => ({ id: i + 1, nome: p[0], categoria_id: p[1], especificacoes: p[2],
    preco: p[3], quantidade: 0, estoque_minimo: p[4] }));
  const movimentacoes = [];
  const t = '2026-09-28 01:35:12';
  MOVS.forEach(([pid, ent, sai, obs]) => {
    movimentacoes.push({ id: movimentacoes.length + 1, produto_id: pid, usuario_id: 1, tipo: 'ENTRADA', quantidade: ent, data_hora: t, observacao: 'Compra inicial' });
    movimentacoes.push({ id: movimentacoes.length + 1, produto_id: pid, usuario_id: 2, tipo: 'SAIDA', quantidade: sai, data_hora: t, observacao: obs });
    produtos[pid - 1].quantidade = ent - sai;
  });
  return { produtos, movimentacoes, proxProduto: produtos.length + 1, proxMov: movimentacoes.length + 1 };
}


const CHAVE = 'estoque_eletronicos_v1';
let DB;
try { DB = JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { DB = null; }
if (!DB) DB = dadosIniciais();
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(DB)); } catch (e) {} };

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pad = n => String(n).padStart(2, '0');
const agora = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
const cat = id => (CATEGORIAS.find(c => c.id === id) || {}).nome || '';
const abaixoMin = p => p.quantidade < p.estoque_minimo; // RN02
const sha256 = async t => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))]
  .map(b => b.toString(16).padStart(2, '0')).join('');

let avisos = [];
const aviso = (tipo, msg) => avisos.push([tipo, msg]);
let rascunho = null; 
let sessao = null;
try { sessao = JSON.parse(sessionStorage.getItem('sessao')); } catch (e) {}
const setSessao = u => { sessao = u; try { u ? sessionStorage.setItem('sessao', JSON.stringify(u)) : sessionStorage.removeItem('sessao'); } catch (e) {} };


function pagina(html, ativo) {
  const nav = [['#/', 'Início', 'inicio'], ['#/produtos', 'Produtos', 'produtos'], ['#/movimentacoes', 'Movimentações', 'movs']]
    .map(([h, t, k]) => `<a href="${h}" ${ativo === k ? 'aria-current="page"' : ''}>${t}</a>`).join('');
  const msgs = avisos.map(([t, m]) => `<div class="aviso ${t}" role="status">${esc(m)}</div>`).join('');
  avisos = [];
  $app.innerHTML = `<header class="topo"><a class="marca" href="#/">Estoque</a><nav>${nav}</nav>
    <span class="usuario">${esc(sessao.nome)} <button class="link" data-sair>Sair</button></span></header>
    <main>${msgs}${html}</main>`;
}


function telaLogin() {
  const msgs = avisos.map(([t, m]) => `<div class="aviso ${t}" role="status">${esc(m)}</div>`).join('');
  avisos = [];
  $app.innerHTML = `<main><section class="login"><h1>Estoque</h1>
    <p class="sub">Entre para controlar produtos e movimentações.</p>${msgs}
    <form data-acao="login">
      <label>Login <input name="login" autocomplete="username" autofocus required></label>
      <label>Senha <input name="senha" type="password" autocomplete="current-password" required></label>
      <button class="btn">Entrar</button></form></section></main>`;
}

function telaInicio() {
  const ps = DB.produtos, alertas = ps.filter(abaixoMin).sort((a, b) => (b.estoque_minimo - b.quantidade) - (a.estoque_minimo - a.quantidade));
  const unid = ps.reduce((s, p) => s + p.quantidade, 0), valor = ps.reduce((s, p) => s + p.quantidade * p.preco, 0);
  const ult = [...DB.movimentacoes].sort((a, b) => b.id - a.id).slice(0, 5);
  pagina(`<h1>Olá, ${esc(sessao.nome.split(' ')[0])}</h1>
    <div class="resumo">
      <div><b>${ps.length}</b> produtos cadastrados</div>
      <div><b>${unid}</b> unidades em estoque</div>
      <div><b>${brl(valor)}</b> em valor de estoque</div>
      <div class="${alertas.length ? 'critico' : ''}"><b>${alertas.length}</b> abaixo do mínimo</div>
    </div>
    <div class="acoes"><a class="btn" href="#/movimentacoes/nova">Registrar movimentação</a>
      <a class="btn sec" href="#/produtos/novo">Novo produto</a></div>
    <h2>Repor com urgência</h2>
    ${alertas.length ? `<div class="tabela"><table><tr><th>Produto</th><th>Categoria</th><th class="n">Em estoque</th><th class="n">Mínimo</th><th></th></tr>
      ${alertas.map(p => `<tr><td>${esc(p.nome)}</td><td>${esc(cat(p.categoria_id))}</td><td class="n baixo">${p.quantidade}</td>
        <td class="n">${p.estoque_minimo}</td><td><a href="#/movimentacoes/nova?produto=${p.id}">Dar entrada</a></td></tr>`).join('')}
      </table></div>` : '<p class="vazio">Nenhum produto abaixo do mínimo.</p>'}
    <h2>Últimas movimentações</h2>${tabelaMovs(ult, false)}
    <p class="rodape">Os dados ficam salvos neste navegador. <button class="link" data-resetar>Restaurar dados de exemplo</button></p>`, 'inicio');
}

function tabelaMovs(lista, comObs) {
  if (!lista.length) return '<p class="vazio">Ainda não há movimentações.</p>';
  return `<div class="tabela"><table><tr><th>Data e hora</th><th>Produto</th><th>Tipo</th><th class="n">Qtd</th><th>Responsável</th>${comObs ? '<th>Observação</th>' : ''}</tr>
    ${lista.map(m => {
      const p = DB.produtos.find(x => x.id === m.produto_id), u = USUARIOS.find(x => x.id === m.usuario_id);
      return `<tr><td>${esc(m.data_hora)}</td><td>${esc(p ? p.nome : '(produto removido)')}</td>
        <td><span class="tag ${m.tipo.toLowerCase()}">${m.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}</span></td>
        <td class="n">${m.quantidade}</td><td>${esc(u ? u.nome : '')}</td>${comObs ? `<td>${esc(m.observacao)}</td>` : ''}</tr>`;
    }).join('')}</table></div>`;
}

function telaProdutos(q) {
  const t = (q || '').trim().toLowerCase();
  const lista = DB.produtos.filter(p => !t || [p.nome, cat(p.categoria_id), p.especificacoes].some(s => (s || '').toLowerCase().includes(t)))
    .sort((a, b) => a.nome.localeCompare(b.nome));
  pagina(`<div class="cabeca"><h1>Produtos</h1><a class="btn" href="#/produtos/novo">Novo produto</a></div>
    <form class="busca" data-acao="busca"><input name="q" value="${esc(q)}" placeholder="Buscar por nome, categoria ou especificação" aria-label="Buscar">
      <button class="btn sec">Buscar</button>${t ? '<a href="#/produtos">Limpar</a>' : ''}</form>
    ${lista.length ? `<div class="tabela"><table><tr><th>Produto</th><th>Categoria</th><th class="n">Preço</th><th class="n">Estoque</th><th class="n">Mínimo</th><th></th></tr>
      ${lista.map(p => `<tr><td>${esc(p.nome)}<small>${esc(p.especificacoes)}</small></td><td>${esc(cat(p.categoria_id))}</td>
        <td class="n">${brl(p.preco)}</td>
        <td class="n ${abaixoMin(p) ? 'baixo' : ''}">${p.quantidade}${abaixoMin(p) ? ' <span class="tag alerta">baixo</span>' : ''}</td>
        <td class="n">${p.estoque_minimo}</td>
        <td class="linha-acoes"><a href="#/movimentacoes/nova?produto=${p.id}">Movimentar</a><a href="#/produtos/editar/${p.id}">Editar</a>
          <button class="link perigo" data-excluir="${p.id}">Excluir</button></td></tr>`).join('')}
      </table></div>` : `<p class="vazio">Nenhum produto encontrado. <a href="#/produtos/novo">Cadastre o primeiro.</a></p>`}`, 'produtos');
}

function telaProdutoForm(id) {
  const novo = !id, base = novo ? { estoque_minimo: 0 } : DB.produtos.find(p => p.id === id);
  if (!base) { aviso('erro', 'Produto não encontrado.'); location.hash = '#/produtos'; return; }
  const p = { ...base, ...(rascunho || {}) }; rascunho = null;
  pagina(`<h1>${novo ? 'Novo produto' : 'Editar produto'}</h1>
    <form class="form" data-acao="produto" data-id="${id || ''}">
      <label>Nome <input name="nome" value="${esc(p.nome)}" required></label>
      <label>Categoria <select name="categoria_id" required><option value="">Escolha…</option>
        ${CATEGORIAS.map(c => `<option value="${c.id}" ${String(p.categoria_id) === String(c.id) ? 'selected' : ''}>${esc(c.nome)}</option>`).join('')}</select></label>
      <label>Especificações <textarea name="especificacoes" rows="3">${esc(p.especificacoes)}</textarea></label>
      <div class="duas">
        <label>Preço (R$) <input name="preco" inputmode="decimal" value="${esc(p.preco)}" required></label>
        <label>Estoque mínimo <input name="estoque_minimo" type="number" min="0" value="${esc(p.estoque_minimo)}"></label>
      </div>
      ${novo ? '' : `<p class="dica">Estoque atual: <b>${base.quantidade}</b>. Para alterar o saldo, registre uma <a href="#/movimentacoes/nova?produto=${id}">movimentação</a>.</p>`}
      <div class="acoes"><button class="btn">${novo ? 'Cadastrar produto' : 'Salvar alterações'}</button><a href="#/produtos">Cancelar</a></div>
    </form>`, 'produtos');
}

function telaMovs() {
  pagina(`<div class="cabeca"><h1>Movimentações</h1><a class="btn" href="#/movimentacoes/nova">Registrar movimentação</a></div>
    ${tabelaMovs([...DB.movimentacoes].sort((a, b) => b.data_hora.localeCompare(a.data_hora) || b.id - a.id), true)}`, 'movs');
}

function telaMovForm(sel) {
  const r = rascunho || {}; rascunho = null;
  sel = r.produto_id ? Number(r.produto_id) : sel;
  const ps = [...DB.produtos].sort((a, b) => a.nome.localeCompare(b.nome));
  pagina(`<h1>Registrar movimentação</h1>
    <form class="form" data-acao="mov">
      <label>Produto <select name="produto_id" required><option value="">Escolha…</option>
        ${ps.map(p => `<option value="${p.id}" ${sel === p.id ? 'selected' : ''}>${esc(p.nome)} (${p.quantidade} em estoque)</option>`).join('')}</select></label>
      <fieldset><legend>Tipo</legend>
        <label class="radio"><input type="radio" name="tipo" value="ENTRADA" ${r.tipo !== 'SAIDA' ? 'checked' : ''}> Entrada</label>
        <label class="radio"><input type="radio" name="tipo" value="SAIDA" ${r.tipo === 'SAIDA' ? 'checked' : ''}> Saída</label></fieldset>
      <label>Quantidade <input name="quantidade" type="number" min="1" value="${esc(r.quantidade)}" required></label>
      <label>Observação <input name="observacao" value="${esc(r.observacao)}" placeholder="Ex.: compra do fornecedor, venda no balcão"></label>
      <div class="acoes"><button class="btn">Registrar</button><a href="#/movimentacoes">Cancelar</a></div>
    </form>`, 'movs');
}


const acoes = {
  async login(f) {
    const login = f.elements.login.value.trim();
    try {
      const h = await sha256(login + ':' + f.elements.senha.value);
      const u = USUARIOS.find(x => x.login === login && x.senha_hash === h);
      if (u) { setSessao({ id: u.id, nome: u.nome }); location.hash = '#/'; return rota(); }
      aviso('erro', 'Login ou senha incorretos.');
    } catch (e) { aviso('erro', 'Não foi possível validar a senha neste navegador (abra o arquivo por http://localhost ou use um navegador atual).'); }
    rota();
  },
  busca(f) { location.hash = '#/produtos' + (f.elements.q.value.trim() ? '?q=' + encodeURIComponent(f.elements.q.value.trim()) : ''); },
  produto(f) { 
    const erros = [], d = Object.fromEntries(new FormData(f));
    const nome = (d.nome || '').trim(), preco = Number(String(d.preco).replace(',', '.')), minimo = Number(d.estoque_minimo || 0);
    if (!nome) erros.push('Informe o nome do produto.');
    if (!CATEGORIAS.some(c => String(c.id) === d.categoria_id)) erros.push('Escolha uma categoria.');
    if (d.preco === '' || !isFinite(preco) || preco < 0) erros.push('O preço deve ser um número maior ou igual a zero.');
    if (!Number.isInteger(minimo) || minimo < 0) erros.push('O estoque mínimo deve ser um número inteiro maior ou igual a zero.');
    if (erros.length) { erros.forEach(e => aviso('erro', e)); rascunho = d; return rota(); }
    const dados = { nome, categoria_id: Number(d.categoria_id), especificacoes: (d.especificacoes || '').trim(), preco, estoque_minimo: minimo };
    if (f.dataset.id) { Object.assign(DB.produtos.find(p => p.id === Number(f.dataset.id)), dados); aviso('ok', 'Produto atualizado.'); }
    else { DB.produtos.push({ id: DB.proxProduto++, quantidade: 0, ...dados }); aviso('ok', 'Produto cadastrado. Registre uma entrada para definir o saldo.'); } // RN03
    salvar(); location.hash = '#/produtos';
  },
  mov(f) { 
    const d = Object.fromEntries(new FormData(f)), qtd = Number(d.quantidade);
    const p = DB.produtos.find(x => x.id === Number(d.produto_id));
    if (!p || !['ENTRADA', 'SAIDA'].includes(d.tipo) || !Number.isInteger(qtd) || qtd <= 0) {
      aviso('erro', 'Escolha o produto, o tipo e uma quantidade maior que zero.'); rascunho = d; return rota();
    }
    if (d.tipo === 'SAIDA' && qtd > p.quantidade) {
      aviso('erro', `Saldo insuficiente: ${p.nome} tem ${p.quantidade} em estoque.`); rascunho = d; return rota();
    }
    p.quantidade += d.tipo === 'ENTRADA' ? qtd : -qtd;
    DB.movimentacoes.push({ id: DB.proxMov++, produto_id: p.id, usuario_id: sessao.id, tipo: d.tipo, quantidade: qtd, data_hora: agora(), observacao: (d.observacao || '').trim() });
    salvar(); aviso('ok', 'Movimentação registrada.');
    if (abaixoMin(p)) aviso('alerta', `Atenção: ${p.nome} ficou com ${p.quantidade} un., abaixo do mínimo de ${p.estoque_minimo}.`);
    location.hash = '#/movimentacoes';
  },
};

document.addEventListener('submit', e => { const a = e.target.dataset.acao; if (a) { e.preventDefault(); acoes[a](e.target); } });
document.addEventListener('click', e => {
  const t = e.target;
  if (t.matches('[data-sair]')) { setSessao(null); aviso('ok', 'Sessão encerrada.'); location.hash = '#/login'; rota(); }
  if (t.matches('[data-excluir]')) { // RF07
    const p = DB.produtos.find(x => x.id === Number(t.dataset.excluir));
    if (DB.movimentacoes.some(m => m.produto_id === p.id)) aviso('erro', 'Este produto tem movimentações e não pode ser excluído.');
    else if (confirm(`Excluir ${p.nome}?`)) { DB.produtos = DB.produtos.filter(x => x !== p); salvar(); aviso('ok', 'Produto excluído.'); }
    rota();
  }
  if (t.matches('[data-resetar]') && confirm('Apagar tudo e voltar aos dados de exemplo?')) { DB = dadosIniciais(); salvar(); aviso('ok', 'Dados de exemplo restaurados.'); rota(); }
});


const $app = document.getElementById('app');
function rota() {
  const [caminho, qs] = (location.hash.slice(1) || '/').split('?'), q = new URLSearchParams(qs || '');
  if (!sessao && caminho !== '/login') { location.hash = '#/login'; return; } // RF02
  if (sessao && caminho === '/login') { location.hash = '#/'; return; }
  let m;
  if (caminho === '/login') telaLogin();
  else if (caminho === '/') telaInicio();
  else if (caminho === '/produtos') telaProdutos(q.get('q'));
  else if (caminho === '/produtos/novo') telaProdutoForm(null);
  else if ((m = caminho.match(/^\/produtos\/editar\/(\d+)$/))) telaProdutoForm(Number(m[1]));
  else if (caminho === '/movimentacoes') telaMovs();
  else if (caminho === '/movimentacoes/nova') telaMovForm(Number(q.get('produto')) || null);
  else location.hash = '#/';
}
addEventListener('hashchange', rota);
rota();
