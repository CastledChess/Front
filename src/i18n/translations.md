# Translations

This document describes how to use the translation system in the project.

## Using translations

There are a few different ways of using translations in the project.
The most common way is to use the `useTranslation` hook from `react-i18next`.
This hook returns a `t` function that can be used to translate strings.

> [!WARNING]  
> Avoid using the render prop method.

[learn more](https://react.i18next.com/guides/quick-start#translate-your-content)

### useTranslation hook

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return <div>{t('myKey')}</div>;
};
```

### Using HOC

```tsx
import React from 'react';

import { withTranslation } from 'react-i18next';

function MyComponent({ t }) {
  return <h1>{t('Welcome to React')}</h1>;
}

export default withTranslation()(MyComponent);
```

### Using the Trans component

```tsx
import React from 'react';
import { Trans } from 'react-i18next';

export default function MyComponent () {
  return <Trans><H1>Welcome to React</H1></Trans>
}

// the translation in this case should be
"<0>Welcome to React</0>": "<0>Welcome to React and react-i18next</0>"
```

### Using i18n outside of React components

```tsx
import i18next from './i18n';

i18next.t('my.key');
```
