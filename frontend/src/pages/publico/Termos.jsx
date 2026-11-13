import { Link } from 'react-router-dom';
import Alert from '../../components/common/Alert.jsx';

export default function Termos() {
  return (
    <article className="texto-legal">
      <h1 className="titulo-1">Termos de uso</h1>
      <p className="apoio">Versão de 13 de novembro de 2026</p>
      <Alert tipo="aviso" titulo="Versão de demonstração">
        O Recicla PE é um protótipo criado no Hackathon APONTI (REC&apos;n&apos;Play 2026). Os valores são demonstrativos e estes termos precisam ser revisados por assessoria jurídica antes de qualquer uso real.
      </Alert>

      <h2>1. O que é o Recicla PE</h2>
      <p>Uma plataforma que conecta moradores, coletores de recicláveis, pontos de coleta e poder público para que o material reciclável chegue ao lugar certo e não aos canais. O programa de incentivo se chama Bolsa Reciclagem.</p>

      <h2>2. Quem pode usar</h2>
      <ul>
        <li>Pessoas a partir de 18 anos, ou menores com autorização e acompanhamento de um responsável.</li>
        <li>Coletores de recicláveis e pontos de coleta só recebem pedidos depois de aprovados pela administração.</li>
        <li>Cada pessoa mantém uma única conta e é responsável pela sua senha.</li>
      </ul>

      <h2>3. Como funciona</h2>
      <ul>
        <li><b>Morador:</b> separa os recicláveis, entrega num ponto de coleta (com QR Code) ou pede a coleta em casa, enviando uma foto dos materiais.</li>
        <li><b>Coletor de recicláveis:</b> vê os pedidos do seu bairro, aceita, pode compartilhar a localização para o morador acompanhar a chegada, confirma a coleta lendo o QR Code do morador e leva o material a um ponto autorizado.</li>
        <li><b>Ponto de coleta:</b> pesa o material e registra a entrega. O valor é calculado pela plataforma com base no peso e no tipo de material.</li>
      </ul>

      <h2>4. Créditos e valores</h2>
      <ul>
        <li>Os créditos da Bolsa Reciclagem e a remuneração dos coletores são, nesta versão, <b>demonstrativos</b> e não podem ser sacados.</li>
        <li>Em uma versão real, os valores dependerão de convênios com prefeituras e empresas e serão informados antes de qualquer cobrança ou pagamento.</li>
        <li>A remuneração do coletor é separada e não reduz o crédito do morador.</li>
        <li>Cada QR Code vale para uma única entrega e expira. Tentativas de fraude (pesagens falsas, códigos reaproveitados, contas duplicadas) levam ao bloqueio da conta.</li>
      </ul>

      <h2>5. Regras para fotos e informações</h2>
      <ul>
        <li>Fotografe apenas os materiais. Não envie fotos de pessoas, documentos, placas de carro ou do número da casa.</li>
        <li>Informe quantidades aproximadas e honestas. Não peça coleta de lixo comum, entulho, resíduos de saúde ou produtos perigosos.</li>
        <li>Lixo eletrônico deve ser entregue sem dados pessoais: apague o aparelho e retire chips e cartões de memória.</li>
      </ul>

      <h2>6. Classificação por inteligência artificial</h2>
      <p>A identificação do material pela foto é uma ajuda e pode errar. O que vale é a pesagem e a conferência no ponto de coleta.</p>

      <h2>7. Responsabilidades</h2>
      <ul>
        <li>A plataforma faz a intermediação. A coleta, o transporte e a pesagem são feitos pelos coletores e pontos cadastrados.</li>
        <li>Combine a coleta em local e horário seguros. Em caso de problema, avise a administração pelo app.</li>
        <li>Podemos suspender contas que descumpram estes termos ou a lei.</li>
      </ul>

      <h2>8. Dados pessoais</h2>
      <p>O uso dos seus dados segue a <Link to="/privacidade">Política de privacidade</Link> e a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>

      <h2>9. Mudanças e foro</h2>
      <p>Avisaremos no app quando estes termos mudarem. Fica eleito o foro da cidade do Recife (PE) para resolver eventuais conflitos.</p>

      <h2>10. Contato</h2>
      <p>Dúvidas: [e-mail de contato do projeto].</p>
    </article>
  );
}
