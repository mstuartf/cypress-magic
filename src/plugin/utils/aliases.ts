export interface RequestAliasArgs {
  url: string;
  method: string;
  status: number;
}

export type AliasBuilder = (args: RequestAliasArgs) => string;

export interface AliasTracker {
  [rawAlias: string]: number;
}

export const buildRequestAlias = ({
  url,
  method,
  status,
}: RequestAliasArgs): string =>
  `${new URL(url).pathname.replace(/\/?$/, "/")}${method}_${status}`;

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
