import type { AnalysisInput, ContentType, Lang } from '../types'
import { getOrCreateSession } from './session'

const URL_PATTERN = /^https?:\/\/.+/i

export function detectInputType(
  text: string,
  hasImage: boolean,
): ContentType {
  if (hasImage) return 'image'
  if (URL_PATTERN.test(text.trim())) return 'url'
  return 'text'
}

export function validateUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Lecture du fichier impossible'))
        return
      }
      const base64 = result.split(',')[1]
      if (!base64) {
        reject(new Error('Encodage base64 invalide'))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Lecture du fichier impossible'))
    reader.readAsDataURL(file)
  })
}

export async function buildAnalysisInput(
  text: string,
  imageFile: File | null,
  lang: Lang,
): Promise<AnalysisInput> {
  const trimmed = text.trim()
  const type = detectInputType(trimmed, Boolean(imageFile))
  const sessionId = getOrCreateSession()

  if (type === 'url' && !validateUrl(trimmed)) {
    throw new Error('URL invalide')
  }

  if (type === 'text' && !trimmed) {
    throw new Error('Le texte est vide')
  }

  if (type === 'image' && !imageFile) {
    throw new Error('Aucune image sélectionnée')
  }

  const input: AnalysisInput = {
    type,
    value: type === 'image' ? (trimmed || imageFile!.name) : trimmed,
    lang,
    sessionId,
  }

  if (type === 'image' && imageFile) {
    input.imageBase64 = await fileToBase64(imageFile)
  }

  return input
}
