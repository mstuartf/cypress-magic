export type AliasBuilder = (
  url: string,
  method: string,
  status: number
) => string;

export const buildRawAlias: AliasBuilder = (url, method, status) =>
  `${new URL(url).pathname}${method}_${status}`;

export const aliasTracker = (): AliasBuilder => {
  const aliasTracker: { [rawAlias: string]: number } = {};
  return (url, method, status) => {
    const rawAlias = buildRawAlias(url, method, status);
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
