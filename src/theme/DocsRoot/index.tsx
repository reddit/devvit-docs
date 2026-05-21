import type { Props } from '@theme/DocsRoot';
import clsx from 'clsx';
import React from 'react';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import renderRoutes from '@docusaurus/renderRoutes';
import Layout from '@theme/Layout';

import CsatWidget from '@site/src/components/CsatWidget';

export default function DocsRoot(props: Props): React.ReactElement {
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.docsPages)}>
      <Layout>
        {renderRoutes(props.route.routes)}
        <CsatWidget />
      </Layout>
    </HtmlClassNameProvider>
  );
}
