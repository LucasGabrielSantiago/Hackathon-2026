import { Link } from 'react-router-dom';
import Alert from '../../components/common/Alert.jsx';

export default function Privacidade() {
  return (
    <article className="texto-legal">
      <h1 className="titulo-1">Política de privacidade</h1>
      <p className="apoio">Versão de 13 de novembro de 2026</p>
      <Alert tipo="aviso" titulo="Versão de demonstração">
        Protótipo do Hackathon APONTI. Nesta versão os dados ficam só na memória do servidor e são apagados quando ele reinicia. Revisar com assessoria jurídica antes de uso real.
      </Alert>

      <h2>1. Quais dados coletamos</h2>
      <ul>
        <li><b>Cadastro:</b> nome, e-mail, telefone (opcional), senha (guardada só como código criptografado), perfil, município e bairro.</li>
        <li><b>Coleta em casa:</b> endereço, horário escolhido, tipos e quantidade de materiais e a foto dos materiais.</li>
        <li><b>Coletores e pontos:</b> bairros atendidos, materiais aceitos e localização do ponto de coleta.</li>
        <li><b>Uso do app:</b> entregas, pesagens, QR Codes e créditos (extrato).</li>
      </ul>

      <h2>2. Para que usamos</h2>
      <ul>
        <li>Criar sua conta e permitir o login.</li>
        <li>Conectar quem pede a coleta com o coletor do bairro e registrar as entregas.</li>
        <li>Calcular créditos e a remuneração dos coletores.</li>
        <li>Gerar indicadores agregados por bairro e material (Índice Canal Limpo), sem identificar pessoas.</li>
        <li>Prevenir fraudes e cumprir obrigações legais.</li>
      </ul>

      <h2>3. Com quem compartilhamos</h2>
      <ul>
        <li><b>Foto e materiais do pedido:</b> visíveis aos coletores aprovados que atendem o seu bairro.</li>
        <li><b>Endereço:</b> só o coletor que aceitar o seu pedido vê.</li>
        <li><b>Prefeituras e empresas parceiras:</b> recebem apenas números agregados, nunca dados pessoais.</li>
        <li><b>Fornecedores de tecnologia</b> (hospedagem e, quando ativada, a IA de classificação de imagens) tratam os dados só para prestar o serviço.</li>
        <li>Não vendemos dados pessoais.</li>
      </ul>

      <h2>4. Fotos</h2>
      <p>Fotografe só os materiais. A foto usada para classificar o resíduo não é guardada. A foto do pedido de coleta fica disponível enquanto o pedido estiver ativo.</p>

      <h2>5. Por quanto tempo guardamos</h2>
      <p>Enquanto a sua conta existir ou pelo prazo exigido por lei. Ao excluir a conta, apagamos os dados pessoais e mantemos só o histórico de transações exigido para auditoria, sem identificação sempre que possível.</p>

      <h2>6. Segurança</h2>
      <p>Usamos conexão criptografada (HTTPS), senhas com hash, acesso por perfil e códigos de uso único. Nenhum sistema é 100% seguro: avise-nos se notar algo estranho.</p>

      <h2>7. Seus direitos (LGPD, art. 18)</h2>
      <ul>
        <li>Confirmar se tratamos seus dados e acessá-los.</li>
        <li>Corrigir dados incompletos ou desatualizados.</li>
        <li>Pedir a exclusão, a portabilidade ou a revogação do consentimento.</li>
        <li>Saber com quem compartilhamos.</li>
      </ul>

      <h2>8. Armazenamento no navegador</h2>
      <p>Guardamos só o código de acesso (token) no seu navegador para manter você conectado. Não usamos cookies de publicidade.</p>

      <h2>9. Contato do encarregado de dados</h2>
      <p>[nome do encarregado] · [e-mail de contato]. Veja também os <Link to="/termos">Termos de uso</Link>.</p>
    </article>
  );
}
