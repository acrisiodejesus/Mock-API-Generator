// Fake data generation utilities
export function generateFakeData(type: string): any {
  switch (type) {
    case "string":
      return generateRandomString()
    case "number":
      return Math.floor(Math.random() * 1000)
    case "boolean":
      return Math.random() > 0.5
    case "email":
      return generateEmail()
    case "name":
      return generateName()
    case "phone":
      return generatePhone()
    case "date":
      return generateDate()
    case "url":
      return generateUrl()
    case "uuid":
      return generateUuid()
    case "image":
      return generateImageUrl()
    default:
      return generateRandomString()
  }
}

function generateRandomString(): string {
  const words = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
  ]
  const length = Math.floor(Math.random() * 5) + 3
  return Array.from({ length }, () => words[Math.floor(Math.random() * words.length)]).join(" ")
}

function generateEmail(): string {
  const names = ["john", "jane", "bob", "alice", "charlie", "diana", "eve", "frank"]
  const domains = ["example.com", "test.com", "demo.com", "mail.com"]
  const name = names[Math.floor(Math.random() * names.length)]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  return `${name}${Math.floor(Math.random() * 1000)}@${domain}`
}

function generateName(): string {
  const firstNames = [
    "João",
    "Maria",
    "Pedro",
    "Ana",
    "Carlos",
    "Juliana",
    "Lucas",
    "Fernanda",
    "Rafael",
    "Camila",
    "Bruno",
    "Beatriz",
  ]
  const lastNames = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Alves",
    "Pereira",
    "Lima",
    "Gomes",
  ]
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  return `${firstName} ${lastName}`
}

function generatePhone(): string {
  const ddd = Math.floor(Math.random() * 90) + 10
  const prefix = Math.floor(Math.random() * 90000) + 10000
  const suffix = Math.floor(Math.random() * 9000) + 1000
  return `(${ddd}) ${prefix}-${suffix}`
}

function generateDate(): string {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

function generateUrl(): string {
  const domains = ["example.com", "test.com", "demo.com", "website.com"]
  const paths = ["home", "about", "contact", "products", "services", "blog"]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const path = paths[Math.floor(Math.random() * paths.length)]
  return `https://${domain}/${path}`
}

function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generateImageUrl(): string {
  const width = [200, 300, 400, 500][Math.floor(Math.random() * 4)]
  const height = [200, 300, 400, 500][Math.floor(Math.random() * 4)]
  return `https://picsum.photos/${width}/${height}`
}
