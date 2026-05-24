import Slugger from "github-slugger"
import { Root } from "mdast"
import { toString } from "mdast-util-to-string"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  maxDepth: 1 | 2 | 3 | 4 | 5 | 6
  minEntries: number
  showByDefault: boolean
  collapseByDefault: boolean
}

const defaultOptions: Options = {
  maxDepth: 3,
  minEntries: 1,
  showByDefault: true,
  collapseByDefault: false,
}

interface TocEntry {
  depth: number
  text: string
  slug: string // this is just the anchor (#some-slug), not the canonical slug
}

function hasCalloutClass(className: any): boolean {
  if (typeof className === "string") {
    return className.split(/\s+/).includes("callout")
  }
  if (Array.isArray(className)) {
    return className.some((value) => typeof value === "string" && value === "callout")
  }
  return false
}

function isCalloutBlockquote(node: any): boolean {
  if (node?.type !== "blockquote") return false
  const props = node.data?.hProperties ?? {}
  return (
    props["data-callout"] !== null || props.dataCallout !== null || hasCalloutClass(props.className)
  )
}

const slugAnchor = new Slugger()
export const TableOfContents: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "TableOfContents",
    markdownPlugins() {
      return [
        () => {
          return async (tree: Root, file) => {
            const display = file.data.frontmatter?.enableToc ?? opts.showByDefault
            if (display) {
              slugAnchor.reset()
              const toc: TocEntry[] = []
              let highestDepth: number = opts.maxDepth

              const calloutHeadings = new Set<any>()
              visit(tree, "blockquote", (node) => {
                if (!isCalloutBlockquote(node)) return
                visit(node, "heading", (heading) => {
                  calloutHeadings.add(heading)
                })
              })
              visit(tree, "heading", (node) => {
                if (calloutHeadings.has(node)) return
                if (node.depth <= opts.maxDepth) {
                  const text = toString(node)
                  highestDepth = Math.min(highestDepth, node.depth)
                  toc.push({
                    depth: node.depth,
                    text,
                    slug: slugAnchor.slug(text),
                  })
                }
              })

              if (toc.length > 0 && toc.length > opts.minEntries) {
                file.data.toc = toc.map((entry) => ({
                  ...entry,
                  depth: entry.depth - highestDepth,
                }))
                file.data.collapseToc = opts.collapseByDefault
              }
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    toc: TocEntry[]
    collapseToc: boolean
  }
}
