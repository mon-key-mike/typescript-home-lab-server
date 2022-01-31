import { InMemoryCache, gql } from '@apollo/client';
import React, { FC, ReactElement } from 'react';
import { RenderOptions, render } from '@testing-library/react';

import { IntlProvider } from 'i18n';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from 'styles';
import { useApollo } from 'app/apollo';

const cache = new InMemoryCache();
cache.writeQuery({
  query: gql`
    query helloAndEchoQueries($str: String!) {
      echoExample(str: $str) {
        exampleField
      }

      hello
    }
  `,
  data: {
    echoExample: {
      __typename: 'Echo',
      exampleField: '/',
    },
    hello: 'GraphQL',
  },
});

const AllTheProviders: FC = ({ children, ...pageProps }) => {
  const apolloClient = useApollo(pageProps);

  return (
    <ThemeProvider theme={muiTheme}>
      <MockedProvider cache={cache}>
        <IntlProvider defaultLocale="en" locale="en" messages={{}}>
          {children}
        </IntlProvider>
      </MockedProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
