import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="home">
      <img src="/logo.svg" alt="" width="96" height="104" />
      <h1>Recicla <span className="azul">PE</span></h1>
      <p className="slogan">Reciclar gera renda. Cuidar transforma cidades.</p>

      <ol className="passos">
        <li><strong>Fotografe</strong> o resíduo e descubra como separar.</li>
        <li><strong>Entregue</strong> num ponto de coleta ou peça a coleta em casa.</li>
        <li><strong>Ganhe</strong> créditos da Bolsa Reciclagem pelo peso entregue.</li>
      </ol>

      <div className="acoes">
        <Link to="/cadastro" className="botao">Criar conta</Link>
        <Link to="/login" className="botao secundario">Já tenho conta</Link>
      </div>
      <p className="nota">Lixo no lugar certo não vai parar no canal. ♻️ Canal Limpo</p>
    </section>
  );
}
