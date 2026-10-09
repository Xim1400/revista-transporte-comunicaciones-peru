// Cliente de prueba end-to-end para el servidor MCP de la revista.
// Lanza el servidor por stdio y ejecuta el flujo completo descrito en el
// README: get_articles -> create_article -> get_article -> publish_article
// -> update_article -> unpublish_article -> delete_article (limpieza).
//
// Uso: node test-client.mjs
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

function logStep(title) {
  console.log(`\n=== ${title} ===`);
}

async function callTool(client, name, args) {
  const result = await client.callTool({ name, arguments: args });
  const payload = result.content?.[0]?.text
    ? JSON.parse(result.content[0].text)
    : result.content;
  if (result.isError) {
    console.error(`[ERROR] ${name}:`, payload);
    throw new Error(`Tool ${name} devolvió un error.`);
  }
  console.log(`[OK] ${name}`);
  return payload;
}

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "server.ts"],
    env: { ...process.env, MCP_TRANSPORT: "stdio" },
  });

  const client = new Client({ name: "test-client", version: "1.0.0" });
  await client.connect(transport);

  const TEST_SLUG = "noticia-de-prueba-mcp";

  try {
    logStep("1. get_articles (estado inicial)");
    const initial = await callTool(client, "get_articles", { page: 1, pageSize: 5 });
    console.log(`Total de artículos existentes: ${initial.total}`);

    logStep("2. create_article");
    const created = await callTool(client, "create_article", {
      title: "Llega el 5G a una nueva región piloto",
      slug: TEST_SLUG,
      excerpt:
        "Una prueba piloto de conectividad 5G arranca en una nueva región, ampliando la cobertura de banda ancha móvil.",
      content:
        "Contenido de prueba generado por el cliente de validación del MCP.\n\nSegundo párrafo de prueba para validar el renderizado del artículo.",
      category: "telecomunicaciones",
      image: "/images/subasta-espectro-5g-resultados.svg",
      author: "Agente de prueba MCP",
      tags: ["5G", "Prueba"],
    });
    console.log(`Creado con estado: ${created.article.status}`);
    if (created.article.status !== "draft") {
      throw new Error("El artículo creado debería estar en estado draft.");
    }

    logStep("3. get_article (por slug)");
    const fetched = await callTool(client, "get_article", { slug: TEST_SLUG });
    console.log(`Título recuperado: ${fetched.title}`);

    logStep("4. publish_article");
    const published = await callTool(client, "publish_article", { slug: TEST_SLUG });
    console.log(`Nuevo estado: ${published.article.status}`);
    if (published.article.status !== "published") {
      throw new Error("El artículo debería estar publicado.");
    }

    logStep("5. set_featured_article");
    const featured = await callTool(client, "set_featured_article", { slug: TEST_SLUG });
    console.log(`Destacado: ${featured.article.featured}`);

    logStep("6. update_article");
    const updated = await callTool(client, "update_article", {
      slug: TEST_SLUG,
      title: "Llega el 5G a una nueva región piloto (actualizado)",
    });
    console.log(`Nuevo título: ${updated.article.title}`);

    logStep("7. unpublish_article");
    const unpublished = await callTool(client, "unpublish_article", { slug: TEST_SLUG });
    console.log(`Estado tras despublicar: ${unpublished.article.status}`);
    if (unpublished.article.status !== "draft") {
      throw new Error("El artículo debería volver a estado draft.");
    }

    logStep("8. get_article_statistics");
    const stats = await callTool(client, "get_article_statistics", {});
    console.log(JSON.stringify(stats, null, 2));

    logStep("9. delete_article (limpieza del artículo de prueba)");
    await callTool(client, "delete_article", { slug: TEST_SLUG });

    console.log("\n✅ Flujo MCP completo verificado correctamente.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("\n❌ Falló la validación del MCP:", err);
  process.exit(1);
});
