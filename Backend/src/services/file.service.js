import path from "path"
import mammoth from "mammoth"
import { extractText , getDocumentProxy } from "unpdf"

const MAX_FILE_TEXT = 50000
const TEXT_EXT = [".txt", ".md", ".csv", ".json"]
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"]

export async function extractFileContent(file) {


    if (!file) return null


    const { originalname, buffer, mimetype } = file
    const ext = path.extname(originalname).toLowerCase()

    if (IMAGE_EXT.includes(ext)) {
    return { type: "image", name: originalname, mimetype, data: buffer.toString("base64") }
  }

  let text
  if (ext === ".pdf") {

    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    ;({ text } = await extractText(pdf, { mergePages: true }))
    
  } else if (ext === ".docx") {
    
    text = (await mammoth.extractRawText({ buffer })).value

  } else if (TEXT_EXT.includes(ext)) {
    
    text = buffer.toString("utf-8")

  } else {
    
    throw new Error(`Unsupported file type: ${ext}`)

  }

  if (!text?.trim()) throw new Error("No readable text found (scanned PDF?)")

  return {
    type: "document",
    name: originalname,
    content: text.slice(0, MAX_FILE_TEXT),
    truncated: text.length > MAX_FILE_TEXT,
  }
}