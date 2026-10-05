// Solo estos namespaces los leen componentes de cliente; el resto se resuelve
// en el servidor y no hace falta serializarlo hacia el navegador.
export const CLIENT_NAMESPACES = ["nav", "common", "theme"] as const;

export function pickClientMessages(
  messages: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));
}
