export const isWrapper = (name: string, allNames: string[]) =>
    allNames.some(other => other.startsWith(name + '::'))

export const getDirectChildren = (parent: string, allNames: string[]) =>
    allNames.filter(name => {
        if (!name.startsWith(parent + '::')) return false
        const rest = name.slice(parent.length + 2)
        return !rest.includes('::')
    })

export const getAllLeafDescendants = (
    parent: string,
    allNames: string[],
    noteCounts: Record<string, number>
): string[] =>
    allNames.filter(name => name.startsWith(parent + '::') && noteCounts[name] > 0)