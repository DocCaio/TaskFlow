const STACK = [
  "React + TypeScript + Vite",
  "TanStack Query para dados do servidor",
  "Zustand para o estado dos filtros",
  "Context API para as notificações",
  "React Router com rotas carregadas sob demanda",
  "Tailwind CSS com tema Halloween",
  "Vitest + Testing Library",
  "Spring Boot + PostgreSQL no back-end",
];

export function Sobre() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-verde">Sobre</h1>
      <p className="text-texto/80">
        TaskFlow é um gerenciador de tarefas criado para praticar testes automatizados, CI/CD,
        código limpo, Docker, performance, Web Vitals e observabilidade.
      </p>

      <h2 className="text-xl font-semibold text-laranja">Stack</h2>
      <ul className="list-inside list-disc space-y-1 text-texto/80">
        {STACK.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
