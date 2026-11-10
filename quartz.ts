import * as ExternalPlugin from "./.quartz/plugins"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

ExternalPlugin.RecentNotes({
  filter: (f) => {
    const slug = f.slug ?? ""
    return slug.startsWith("records/") && slug !== "records/index" && slug !== "records"
  },
} as Partial<ExternalPlugin.RecentNotesOptions>)

const config = await loadQuartzConfig({})
export default config
export const layout = await loadQuartzLayout()
