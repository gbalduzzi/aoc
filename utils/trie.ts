
export class Trie {
    root: TrieNode

    constructor(root: TrieNode) {
        this.root = root
    }

    static build(words: string[]): Trie {
        const root = new TrieNode("", "", false)

        for(const word of words) {
            let wordNode = root
            let partialWord = ""
            for (const l of word) {
                partialWord += l
                if (!wordNode.branches.has(l)) {
                    wordNode.addBranch(l, new TrieNode(l, partialWord, false))
                }
                wordNode = wordNode.branches.get(l)!
            }

            wordNode.isLeaf = true
        }

        return new Trie(root)
    }

    search = (word: string): TrieNode | null => {
        let wordNode = this.root
        for (const l of word) {
            if (!wordNode.branches.has(l)) {
                return null
            }
            wordNode = wordNode.branches.get(l)!
        }
        return wordNode
    }

    byPrefix = (prefix: string): string[] => {
        const prefixNode = this.search(prefix)

        if (prefixNode === null) return []

        return this.wordsFromNode(prefixNode, [])
    }

    wordsFromNode = (node: TrieNode, words: string[]): string[] => {
        for (const [, branchNode] of node.branches) {
            if (branchNode.isLeaf) words.push(branchNode.word)
            this.wordsFromNode(branchNode, words)
        }
        return words
    }

    matches = (candidate: string): string[] => {
        const words: string[] = []

        let currentNode = this.root
        for (const l of candidate) {
            if (!currentNode.branches.has(l)) break

            currentNode = currentNode.branches.get(l)!

            if (currentNode.isLeaf) words.push(currentNode.word)
        }

        return words
    } 

    
}

class TrieNode {
    public word: string
    public letter: string
    public isLeaf: boolean

    public branches: Map<string, TrieNode> = new Map()

    constructor(letter: string, word: string, isLeaf: boolean) {
        this.letter = letter
        this.word = word
        this.isLeaf = isLeaf
    }

    addBranch(letter: string, node: TrieNode) {
        this.branches.set(letter, node)
    }
}
