module.exports = function({ site, title, page, content, collections }) {
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
          <base href="/" />
          <link rel="stylesheet" href="/style.css" />
      </head>
      <body class="sticky-footer">
          <header class="site-header">
              <h1 class="site-title">
                <a class="site-title__link" href="/">
                    ${this.svgContents('/src/site/logo.svg', 'site-logo')}<span class="site-title__text">Peter Sharp</span>
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
          <main class="sticky-footer__content stack stack--gap-900">
              ${content}
          </main>
          <footer class="wrapper site-footer sticky-footer__footer">
              <div class="wrapper__inner cluster">
                <section class="">
                    <a href="/contact">Contact me</a>
                </section>
                <section>
                    <h2 class="visually-hidden">Social media</h2>
                    <ul class="unstyled-list">
                        <li><a rel="me" href="https://github.com/peter-sharp">Github</a></li>
                    </ul>
                </section>
                <section class="">
                    <a href="/resume">My resume</a>
                </section>
              </div>
          </footer>
      </body>
  </html>
  `
}
