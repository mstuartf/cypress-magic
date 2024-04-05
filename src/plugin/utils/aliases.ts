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

export const buildAliasTracker = (
  getAliasTracker: () => AliasTracker,
  onUpdate: (updated: AliasTracker) => void
): AliasBuilder => {
  return (args) => {
    const aliasTracker = { ...getAliasTracker() };
    let rawAlias = buildRequestAlias(args);
    if (!aliasTracker.hasOwnProperty(rawAlias)) {
      aliasTracker[rawAlias] = 0;
    } else {
      aliasTracker[rawAlias] = aliasTracker[rawAlias] + 1;
    }
    onUpdate(aliasTracker);
    if (aliasTracker[rawAlias] > 0) {
      return `${rawAlias}_${aliasTracker[rawAlias]}`;
    }
    return rawAlias;
  };
};
