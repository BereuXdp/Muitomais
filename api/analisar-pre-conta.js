// Função de servidor: lê a foto da pré-conta com o Claude e liga cada linha aos pedidos da mesa.
// Formato de função da Vercel (pasta /api). Em outro host, adapte só a assinatura do handler.
//
// Precisa da variável de ambiente ANTHROPIC_API_KEY no servidor. NUNCA coloque a chave no front-end.
//
// Entrada (POST JSON):
//   { imagem: "<base64 sem prefixo data:>", media_type: "image/jpeg",
//     itens: [{ id: "abc123", nome: "Chopp", pessoa: "Lucas" }, ...] }
// Saída (JSON):
//   { linhas: [{ descricao, quantidade, valor_unitario, valor_total, item_ids: ["abc123"] }],
//     subtotal, taxa_servico, total }        (valores em reais, ex.: 14.9)
//   ou { erro: "mensagem para o cliente" }

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const SCHEMA = {
  type: "object",
  properties: {
    legivel: { type: "boolean", description: "false se a foto não é de uma pré-conta/comanda ou não dá para ler os itens" },
    linhas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          descricao: { type: "string" },
          quantidade: { type: "integer" },
          valor_unitario: { type: "number" },
          valor_total: { type: "number" },
          item_ids: { type: "array", items: { type: "string" } },
        },
        required: ["descricao", "quantidade", "valor_unitario", "valor_total", "item_ids"],
        additionalProperties: false,
      },
    },
    subtotal: { type: "number" },
    taxa_servico: { type: "number" },
    total: { type: "number" },
  },
  required: ["legivel", "linhas", "subtotal", "taxa_servico", "total"],
  additionalProperties: false,
};

const SYSTEM = `Você lê fotos de pré-contas (conferência de mesa) de restaurantes brasileiros e divide a conta entre as pessoas.

1. Transcreva cada linha de consumo da pré-conta: descrição como está impressa, quantidade, valor unitário e valor total da linha, em reais (número com ponto decimal, ex.: 14.9).
2. Não trate como linha de consumo: taxa de serviço / gorjeta / 10%, subtotal, total, descontos, pagamentos ou troco. A taxa de serviço vai em "taxa_servico" (0 se não houver) e o total final em "total".
3. Ligue cada pedido da mesa (lista com id, nome e pessoa) à linha que corresponde a ele, colocando o id em "item_ids". Os nomes são escritos à mão pelos clientes e as linhas vêm abreviadas (ex.: "coca" = "REFRIG COCA-COLA LT 350"). Regras:
   - Uma linha com quantidade 2 pode receber dois pedidos de pessoas diferentes.
   - Se mais pedidos do que a quantidade apontam para a mesma linha (ex.: duas pessoas dividiram uma pizza), ligue todos: a linha será dividida entre eles.
   - Cada id aparece no máximo em uma linha. Se nenhuma linha corresponde a um pedido, não use o id.
   - Linha que ninguém pediu fica com "item_ids" vazio.
4. Se a imagem não for uma pré-conta legível, responda "legivel": false e "linhas" vazio.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Use POST." });

  const { imagem, media_type = "image/jpeg", itens = [] } = req.body || {};
  if (typeof imagem !== "string" || !imagem) return res.status(400).json({ erro: "Envie a foto da pré-conta." });
  if (!["image/jpeg", "image/png", "image/webp"].includes(media_type)) return res.status(400).json({ erro: "Formato de imagem não aceito." });
  if (Buffer.byteLength(imagem, "base64") > MAX_IMAGE_BYTES) return res.status(413).json({ erro: "Foto grande demais." });
  if (!Array.isArray(itens) || itens.length > 200) return res.status(400).json({ erro: "Lista de pedidos inválida." });

  const pedidos = itens.map((i) => ({ id: String(i.id).slice(0, 20), nome: String(i.nome).slice(0, 60), pessoa: String(i.pessoa || "").slice(0, 40) }));

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type, data: imagem } },
            { type: "text", text: `Pedidos da mesa:\n${JSON.stringify(pedidos)}` },
          ],
        },
      ],
    });

    if (response.stop_reason === "refusal") return res.status(200).json({ erro: "Não foi possível analisar essa imagem." });
    if (response.stop_reason === "max_tokens") return res.status(200).json({ erro: "A pré-conta é longa demais. Tente fotografar em duas partes." });

    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const data = JSON.parse(text);
    if (!data.legivel || !data.linhas.length) {
      return res.status(200).json({ erro: "Não encontramos itens nessa foto. Tente de novo, com a pré-conta inteira e sem reflexo." });
    }

    // segurança: só devolve ids que vieram da mesa
    const ids = new Set(pedidos.map((p) => p.id));
    data.linhas.forEach((l) => { l.item_ids = l.item_ids.filter((id) => ids.has(id)); });
    delete data.legivel;
    return res.status(200).json(data);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return res.status(429).json({ erro: "Muita gente usando agora. Tente de novo em instantes." });
    if (err instanceof Anthropic.APIError) {
      console.error("Claude API", err.status, err.message);
      return res.status(502).json({ erro: "A leitura da pré-conta falhou. Tente de novo." });
    }
    console.error(err);
    return res.status(500).json({ erro: "A leitura da pré-conta falhou. Tente de novo." });
  }
}
