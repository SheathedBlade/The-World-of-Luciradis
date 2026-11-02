import { RecentNotesOptions } from "@quartz-community/recent-notes"
import { componentRegistry } from "./quartz/components/registry"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

componentRegistry.setOptionOverrides("@quartz-community/recent-notes", {
  filter: (f) => {
    const slug = f.slug ?? ""
    return slug.startsWith("records/") && slug !== "records/index" && slug !== "records"
  },
} as Partial<RecentNotesOptions>)

const config = await loadQuartzConfig({})
export default config
export const layout = await loadQuartzLayout()
