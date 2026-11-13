export default function AvisoDemo({ children = 'Dados e valores de demonstração.' }) {
  return <p className="aviso-demo" role="note">🧪 {children}</p>;
}
