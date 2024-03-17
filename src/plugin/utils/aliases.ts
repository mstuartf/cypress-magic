export interface RequestAliasArgs {
  url: string;
  method: string;
}

export type AliasBuilder = (args: RequestAliasArgs) => string;

export interface AliasTracker {
  [rawAlias: string]: number;
}

export const buildRequestAlias = ({ url, method }: RequestAliasArgs): string =>
  `${method}__${new URL(url).pathname.replace(/\/?$/, "/")}`;

export const buildAliasTracker = (): AliasBuilder => {
  const aliasTracker: AliasTracker = {};
  return (args) => {
    let rawAlias = buildRequestAlias(args);
    if (!aliasTracker.hasOwnProperty(rawAlias)) {
      aliasTracker[rawAlias] = 0;
    } else {
      aliasTracker[rawAlias] = aliasTracker[rawAlias] + 1;
    }
    if (aliasTracker[rawAlias] > 0) {
      return `${rawAlias}_${aliasTracker[rawAlias]}`;
    }
    return rawAlias;
  };
};
