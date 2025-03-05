import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "SheathedBlade/The-World-of-Luciradis",
        repoId: "R_kgDOKS61Gw",
        category: "Announcements",
        categoryId: "DIC_kwDOKS61G84CkjQD",
        reactionsEnabled: false,
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/SheathedBlade/The-World-of-Luciradis",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Records",
        limit: 3,
        filter: (f) =>
          f.slug!.startsWith("Records/") && f.slug! !== "Records/index" && !f.frontmatter?.noindex,
        linkToMore: "Records/" as SimpleSlug,
      }),
    ),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  right: [],
}
