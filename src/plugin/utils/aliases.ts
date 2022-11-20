import { StorageType } from "../types";

export interface RequestAliasArgs {
  url: string;
  method: string;
  status: number;
}

export interface StorageAliasArgs {
  type: StorageType;
}

export type AliasBuilder = (
  args: StorageAliasArgs | RequestAliasArgs
) => string;

export interface AliasTracker {
  [rawAlias: string]: number;
}

export type AliasBuilderConstructor = (
  starter: AliasTracker,
  onUpdate: (aliases: AliasTracker) => void
) => AliasBuilder;

const buildRequestAlias = ({ url, method, status }: RequestAliasArgs): string =>
  `${new URL(url).pathname.replace(/\/?$/, "/")}${method}_${status}`;

const buildStorageAlias = ({ type }: StorageAliasArgs): string => type;

function isRequest(
  args: RequestAliasArgs | StorageAliasArgs
): args is RequestAliasArgs {
  return (args as RequestAliasArgs).url !== undefined;
}

export const buildAliasTracker: AliasBuilderConstructor = (
  starter,
  onUpdate
) => {
  const aliasTracker: AliasTracker = { ...starter };
  return (args) => {
    let rawAlias: string;
    if (isRequest(args)) {
      rawAlias = buildRequestAlias(args);
    } else {
      rawAlias = buildStorageAlias(args);
    }
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
