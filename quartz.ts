import * as ExternalPlugin from "./.quartz/plugins"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { SimpleSlug } from "./quartz/util/path"

ExternalPlugin.RecentNotes({
  title: "Recent Records",
  limit: 3,
  filter: (f: any) =>
    f.slug!.startsWith("records/") && f.slug! !== "records/index" && !f.frontmatter?.noindex,
  linkToMore: "records/" as SimpleSlug,
})

ExternalPlugin.TableOfContentsTransformer({ maxDepth: 2 })

ExternalPlugin.Explorer({
  title: "Explorer",
  folderDefaultState: "collapsed",
  folderClickBehavior: "collapse",
  useSavedState: true,
})

const config = await loadQuartzConfig({
  theme: {
    typography: {
      title: {
        name: "Hanken Grotesk",
        weights: [700, 800, 900],
        includeItalic: false,
      },
      header: {
        name: "Lexend",
        weights: [500, 600],
        includeItalic: true,
      },
      body: "Satoshi Variable",
      code: "Azeret Mono",
    },
    cdnCaching: true,
    fontOrigin: "googleFonts",
    colors: {
      lightMode: {
        light: "#eee9d6",
        lightgray: "#817e76",
        gray: "#b8b8b8",
        darkgray: "#4e4e4e",
        dark: "#2b2b2b",
        secondary: "#3d5a6e",
        tertiary: "#6b8f8f",
        highlight: "rgba(143, 159, 169, 0.15)",
        textHighlight: "#fff23688",
      },
      darkMode: {
        light: "#1c2127",
        lightgray: "#393639",
        gray: "#646464",
        darkgray: "#d4d4d4",
        dark: "#e83479",
        secondary: "#d699b6",
        tertiary: "#ffcfe1",
        highlight: "rgba(143, 159, 169, 0.15)",
        textHighlight: "#b3aa0288",
      },
    },
  },
})
export default config
export const layout = await loadQuartzLayout()
