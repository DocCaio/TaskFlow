export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 2000;

export function validateTask(values: { title: string; description: string }) {
  const errors: Record<string, string> = {};

  if (values.title.trim() === "") {
    errors.title = "O título é obrigatório";
  } else if (values.title.trim().length > TITLE_MAX) {
    errors.title = `O título pode ter no máximo ${TITLE_MAX} caracteres`;
  }

  if (values.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `A descrição pode ter no máximo ${DESCRIPTION_MAX} caracteres`;
  }

  return errors;
}
