import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon.jsx';
import Badge from '../../components/common/Badge.jsx';
import MaterialCard from '../../components/recycling/MaterialCard.jsx';
import { api } from '../../services/api.js';

export default function Home() {
  const [materiais, setMateriais] = useState([]);
  useEffect(() => { api('/materiais').then((d) => setMateriais(d.materiais)).catch(() => {}); }, []);

  return (
    <>
      <section className="hero" style={{ margin: 'calc(-1 * var(--espaco-4)) calc(-1 * var(--espaco-4)) 0' }}>
        <div className="hero-interno">
          <p className="eyebrow">BOLSA RECICLAGEM</p>
          <h1>Recicla PE: reciclar gera renda. Cuidar transforma cidades.</h1>
          <p>Separe seus recicláveis, encontre pontos de coleta ou solicite a retirada em casa e receba por quilo entregue.</p>
          <div className="linha" style={{ marginTop: 8 }}>
            <Link className="rp-btn rp-btn-secundario" to="/cadastro" style={{ flex: 1 }}>Criar conta</Link>
            <a className="rp-btn rp-btn-fantasma" href="#como-funciona">Como funciona</a>
          </div>
        </div>
      </section>

      <h2 className="secao" id="como-funciona">Como funciona</h2>
      <div className="grade-3">
        <div className="passo"><Icon name="camera" />Identifique<span>A IA diz o material</span></div>
        <div className="passo"><Icon name="pin" />Entregue<span>No ponto ou em casa</span></div>
        <div className="passo"><Icon name="coin" />Receba<span>Créditos por quilo</span></div>
      </div>

      {materiais.length > 0 && (
        <>
          <h2 className="secao">Quanto vale</h2>
          <div className="pilha">{materiais.map((m) => <MaterialCard key={m.id} material={m} />)}</div>
          <Badge tipo="aviso">Valores demonstrativos</Badge>
        </>
      )}

      <div className="rp-card">
        <p className="rp-card-titulo">É coletor(a) de recicláveis ou tem um ponto de coleta?</p>
        <p className="rp-card-texto">Receba pedidos perto de você, abra seu próprio ponto e tenha remuneração própria por quilo.</p>
        <Link className="rp-btn rp-btn-secundario" to="/cadastro">Quero participar</Link>
      </div>
      <div className="rp-card">
        <p className="rp-card-titulo">Empresas e prefeituras</p>
        <p className="rp-card-texto">Acompanhe o Índice Canal Limpo: quilos recuperados por bairro e por material.</p>
      </div>

      <footer className="rp-footer" style={{ margin: '0 calc(-1 * var(--espaco-4)) calc(-1 * var(--espaco-6))', width: 'auto' }}>
        <b>Recicla PE</b>
        <span>Reciclar gera renda. Cuidar transforma cidades.</span>
        <span>Lixo no lugar certo não vai parar no canal.</span>
        <span><Link to="/termos" style={{ color: 'inherit' }}>Termos de uso</Link> · <Link to="/privacidade" style={{ color: 'inherit' }}>Política de privacidade</Link></span>
      </footer>
    </>
  );
}
