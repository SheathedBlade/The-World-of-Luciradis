import { RecentNotes } from "@quartz-community/recent-notes"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

RecentNotes({
  filter: (f) => {
    const slug = f.slug ?? ""
    return (
      slug.startsWith("records/") &&
      slug !== "records/index" &&
      slug !== "records" &&
      !f.frontmatter?.noindex
    )
  },
})

const config = await loadQuartzConfig({})
export default config
export const layout = await loadQuartzLayout()
