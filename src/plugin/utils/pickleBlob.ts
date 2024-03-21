import mimeDb from "mime-db";

export type PickledBlob = string;

// Need to pickle blobs so they can be cached in local storage.
export const pickleBlob = (blob: Blob): Promise<PickledBlob> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      resolve(
        JSON.stringify({
          dataUri: reader.result,
          size: blob.size,
          type: blob.type,
        })
      );
    };
  });

export const unPickleBlob = (
  name: string,
  pickle: PickledBlob
): Promise<{ name: string; blob: Blob }> =>
  new Promise((resolve, reject) => {
    const { dataUri, size, type } = JSON.parse(pickle);
    if (size === 0) {
      // in this case the data URI will be invalid
      resolve({ name, blob: new Blob([], { type }) });
      return;
    }
    fetch(dataUri)
      .then((res) => res.blob().then((blob) => resolve({ name, blob })))
      .catch(() => {
        reject(`error generating ${name}`);
      });
  });

export const getBlobFileExtension = (blob: Blob): string => {
  const mimeInfo = mimeDb[blob.type];
  return mimeInfo && mimeInfo.extensions && mimeInfo.extensions.length
    ? mimeInfo.extensions[0]
    : "json";
};

export const aliasToFileName = (alias: string) => alias.replaceAll("/", "_");
