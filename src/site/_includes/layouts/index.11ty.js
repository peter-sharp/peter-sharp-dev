module.exports = function({ site, title, page, content, description = '', collections }) {
  return /*html*/`
  <!DOCTYPE html>
  <html lang="en" ng-app="portfolioApp">
      <head>
          <meta charset="UTF-8" />

          <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <title>${title} | ${site.title}</title>
          <meta name="description" content="${description}" />
          <base href="/" />
          <link rel="stylesheet" href="/style.css" />

              <!-- Facebook -->
            <meta property="og:title" content="${title}" />
            <meta property="og:image" content="https://${site.url}/social-media-banner.png" />
            <meta property="og:site_name" content="${site.title}" />
            <meta property="og:description" content="${description}" />
            <script src="https://getinsights.io/js/insights.js"></script>
            <script>
                insights.init("${site.insightId}")
                insights.trackPages()
            </script>
      </head>
      <body class="sticky-footer h-card">
          <header class="site-header">
              <h1 class="site-title">
                <a class="site-title__link" href="/">
                    ${this.svgContents('/src/site/logo.svg', 'site-logo')}<span class="site-title__text p-name">Peter Sharp</span>
                </a>
              </h1>
              <nav class="nav-main">
                  <ul class="nav-main__items">
                      ${collections.siteNav.map(
                          ({ data, url: itemUrl }) => /*html*/`
                              <li
                                  class="nav-item ${page.url == itemUrl
                                      ? "nav-item--active"
                                      : ""}"
                              >
                                  <a class="nav-item__link" href="${itemUrl}"
                                      >${data.title}</a
                                  >

                              </li>
                          `
                      ).join('\n')}
                  </ul>
              </nav>
          </header>
          <main class="sticky-footer__content stack stack--gap-900 pad-bottom-900">
              ${content}
          </main>
          <footer class="wrapper site-footer sticky-footer__footer">
              <div class="wrapper__inner cluster">
                <section class="">
                    <a class="site-footer__link" href="/contact">Contact me</a>
                </section>
                <section>
                    <h2 class="visually-hidden">Social media</h2>
                    <ul class="unstyled-list cluster">
                        <li><a rel="me" class="u-url site-footer__link" href="https://github.com/peter-sharp">Github</a></li>
                        <li><a rel="me" class="u-url site-footer__link" href="https://www.linkedin.com/in/peter-v-sharp/">Linkedin</a></li>
                    </ul>
                </section>
                <section class="">
                    <a class="u-url site-footer__link" href="/resume">My resume</a>
                </section>
              </div>
          </footer>
      </body>
  </html>
  `
}
