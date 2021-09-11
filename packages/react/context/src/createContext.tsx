import * as React from 'react';

interface ProviderProps {
  scope?: string;
  children: React.ReactNode;
}

type ContextValue<T> = {
  value: T;
  scope: string;
  parentContext?: ContextValue<T>;
};

function createContext<T extends object | null>(defaultContext?: T) {
  const Context = React.createContext<ContextValue<T>>(defaultContext as any);

  function Provider(props: T & ProviderProps) {
    const { scope, children, ...providerProps } = props;
    const propValues = Object.values(providerProps);
    const parentContext = React.useContext(Context);
    const value = React.useMemo(
      () => ({ value: providerProps, scope: scope, parentContext }),
      // we spread prop values so that it's not a new object on every render
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...propValues, scope, parentContext]
    ) as ContextValue<T>;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(part: string, scope: string): T {
    const currentContext = React.useContext(Context);
    const context = (function getContext(context?: ContextValue<T>): T | undefined {
      if (!context) return currentContext.value;
      return context.scope === scope ? context.value : getContext(context.parentContext);
    })(currentContext);

    if (context === undefined) {
      // if there is no defaultContext it was a required context so we error.
      if (defaultContext === undefined) {
        throw new Error(`\`${part}\` must be used within \`${scope}\``);
      }
      return defaultContext;
    }
    return context;
  }
  Provider.displayName = 'Provider';
  return [Provider, useContext] as const;
}

export { createContext };
export type { ProviderProps };
