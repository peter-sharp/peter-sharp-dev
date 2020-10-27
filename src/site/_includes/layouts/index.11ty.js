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
          <link rel="icon" type="image/png" href="favicon.png" />
          <title>${title} | ${site.title}</title>
          <base href="/" />
          <link rel="stylesheet" href="/style.css" />
      </head>
      <body class="sticky-footer stack stack--gap-large">
          <header class="site-header">
              <h1 class="site-title">
                ${this.svgContents('/src/site/logo.svg', 'site-logo')}<span class="site-title__text">Peter Sharp</span>
              </h1>
              <nav class="site-nav">
                  <ul class="site-nav__items">
                      ${collections.siteNav.map(
                          ({ data, url: itemUrl }) => `
                              <li
                                  class="nav-item ${true /* check is Active*/
                                      ? "nav-item--active"
                                      : ""}"
                              >
                                  <a class="nav-item__link" href="${itemUrl}"
                                      >${data.title}</a
                                  >

                              </li>
                          `
                      )}
                  </ul>
              </nav>
          </header>
          <main class="sticky-footer__content">
              ${content}
          </main>
          <footer class="section sticky-footer__footer">
              <div class="">
                  <a href="/contact">Hire me</a>
              </div>
          </footer>
      </body>
  </html>
  `
}
