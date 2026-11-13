// Regra 5: QR Code único, com validade e uso único.
const crypto = require('crypto');
const { ErroNegocio } = require('./erros');

function gerarCodigo(lista, { tipo, referenciaId, usuarioId, validadeMinutos = 30, agora = new Date() }) {
  const registro = {
    codigo: crypto.randomUUID(),
    tipo, // 'entrega' (morador no ponto) | 'pedido' (coleta em casa)
    referencia_id: referenciaId ?? null,
    usuario_id: usuarioId,
    expira_em: new Date(agora.getTime() + validadeMinutos * 60000).toISOString(),
    usado_em: null,
  };
  lista.push(registro);
  return registro;
}

function validar(lista, codigo, { tipo, agora = new Date() } = {}) {
  const registro = lista.find((q) => q.codigo === codigo);
  if (!registro || (tipo && registro.tipo !== tipo)) throw new ErroNegocio('QR_INVALIDO', 'QR Code inválido.');
  if (registro.usado_em) throw new ErroNegocio('QR_JA_UTILIZADO', 'QR Code já utilizado.', 409);
  if (new Date(registro.expira_em) <= agora) throw new ErroNegocio('QR_EXPIRADO', 'QR Code expirado.');
  return registro;
}

function consumir(lista, codigo, opcoes = {}) {
  const registro = validar(lista, codigo, opcoes);
  registro.usado_em = (opcoes.agora || new Date()).toISOString();
  return registro;
}

module.exports = { gerarCodigo, validar, consumir };
