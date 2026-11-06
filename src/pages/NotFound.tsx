import { Link } from "react-router-dom";
import { buttonStyles } from "../components/ui/buttonStyles";

export function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold text-laranja">Página não encontrada</h1>
      <p className="text-texto/70">O endereço que você tentou acessar não existe.</p>
      <Link to="/" className={buttonStyles("primary")}>
        Voltar para a Home
      </Link>
    </section>
  );
}
