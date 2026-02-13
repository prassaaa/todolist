export const tagColors: Record<string, string> = {
  bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  feature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  refactor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  bugfix: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  improvement: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  documentation: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  chore: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export function getTagColor(tag: string): string {
  return tagColors[tag.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}
