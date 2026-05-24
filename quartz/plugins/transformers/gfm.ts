import { Root } from "hast"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import smartypants from "remark-smartypants"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  enableSmartyPants: boolean
  linkHeadings: boolean
}

const defaultOptions: Options = {
  enableSmartyPants: true,
  linkHeadings: true,
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
  if (node?.type !== "element" || node.tagName !== "blockquote") return false
  const props = node.data?.hProperties ?? {}
  return (
    props["data-callout"] !== null || props.dataCallout !== null || hasCalloutClass(props.className)
  )
}

function removeCalloutHeadingAnchors() {
  return (tree: Root) => {
    const calloutHeadings = new Set<any>()
    visit(tree, "element", (node: any) => {
      if (!isCalloutBlockquote(node)) return
      visit(node, "element", (child: any) => {
        if (/^h[1-6]$/.test(child.tagName)) {
          calloutHeadings.add(child)
        }
      })
    })
    visit(tree, "element", (node: any) => {
      if (!calloutHeadings.has(node)) return
      if (node.properties) {
        delete node.properties.id
      }
      if (Array.isArray(node.children)) {
        node.children = node.children.filter((child: any) => {
          if (child?.type !== "element" || child.tagName !== "a") return true
          return child.properties?.role !== "anchor"
        })
      }
    })
  }
}

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm]
    },
    htmlPlugins() {
      if (opts.linkHeadings) {
        return [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                role: "anchor",
                ariaHidden: true,
                tabIndex: -1,
                "data-no-popover": true,
              },
              content: {
                type: "element",
                tagName: "svg",
                properties: {
                  width: 18,
                  height: 18,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                },
                children: [
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                    },
                    children: [],
                  },
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                    },
                    children: [],
                  },
                ],
              },
            },
          ],
          () => removeCalloutHeadingAnchors(),
        ]
      } else {
        return []
      }
    },
  }
}
