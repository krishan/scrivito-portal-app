import { configure, unstable_enableOfflineStore } from 'scrivito'
import { baseUrlForSite, siteForUrl } from './scrivitoSites'
import { scrivitoTenantId } from './scrivitoTenants'

export function configureScrivito() {
  configure({
    adoptUi: 'http://localhost:8090',
    autoConvertAttributes: true,
    baseUrlForSite,
    contentTagsForEmptyAttributes: false,
    extensionsUrl: `/_scrivito_extensions.html?tenantId=${scrivitoTenantId()}`,
    optimizedWidgetLoading: true,
    siteForUrl,
    strictSearchOperators: true,
    tenant: scrivitoTenantId(),
    // @ts-expect-error // TODO: Remove later on
    unstable: {
      assetUrlBase: 'http://localhost:8091',
      allowOfflineMode: true,
      trustedUiOrigins: [
        'http://localhost:8090',
        'https://*.scrivito-ui.pages.dev',
      ],
    },
  })
}

unstable_enableOfflineStore()
