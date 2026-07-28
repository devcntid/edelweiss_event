import { sql } from "@/lib/neon"

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function inlineHtmlToWhatsApp(html: string): string {
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<[^>]+>/g, "")

  text = decodeHtmlEntities(text)
  return text.replace(/[ \t]+/g, " ").trim()
}

/** Convert HTML payment instruction description to WhatsApp-friendly plain text. */
export function htmlToWhatsAppText(html: string): string {
  if (!html) return ""

  let text = html

  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content: string) => {
    const items = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    return items.map((match, index) => `${index + 1}. ${inlineHtmlToWhatsApp(match[1])}`).join("\n")
  })

  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content: string) => {
    const items = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    return items.map((match) => `• ${inlineHtmlToWhatsApp(match[1])}`).join("\n")
  })

  text = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<[^>]+>/g, "")

  text = decodeHtmlEntities(text)
  return text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

type PaymentInstructionRow = {
  title: string | null
  description: string | null
}

/** Format all payment instructions for a channel as WhatsApp text. */
export function formatPaymentInstructionsForWhatsApp(instructions: PaymentInstructionRow[]): string {
  if (!instructions.length) return "-"

  return instructions
    .map((instruction) => {
      const title = instruction.title?.trim()
      const steps = htmlToWhatsAppText(instruction.description || "")
      if (title && steps) return `*${title}*\n${steps}`
      if (title) return `*${title}*`
      return steps
    })
    .filter(Boolean)
    .join("\n\n")
}

/** Fetch payment instructions by channel and format for WhatsApp checkout notif. */
export async function getPaymentInstructionsWhatsAppText(paymentChannelId: number | string | null | undefined): Promise<string> {
  if (paymentChannelId == null || paymentChannelId === "") return "-"

  const instructions = await sql`
    SELECT title, description
    FROM payment_instructions
    WHERE payment_channel_id = ${paymentChannelId}
    ORDER BY step_order ASC NULLS LAST, id ASC
  `

  return formatPaymentInstructionsForWhatsApp(instructions as PaymentInstructionRow[])
}
