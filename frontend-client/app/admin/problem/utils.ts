import type { Language } from '@/types/type'
import { gql } from '@apollo/client'

export const inputStyle =
  'border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950'

export const levels = ['Level1', 'Level2', 'Level3', 'Level4', 'Level5']

export const languageOptions = [
  'C',
  'Cpp',
  'Golang',
  'Java',
  'Python2',
  'Python3'
]

export interface TemplateLanguage {
  language: Language
  isVisible: boolean
}

export const GET_TAGS = gql`
  query GetTags {
    getTags {
      id
      name
    }
  }
`