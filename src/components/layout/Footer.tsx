const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-borda bg-superficie py-6 text-center text-sm text-laranja">
      © {currentYear} Caio. Todos os direitos reservados.
    </footer>
  );
}
