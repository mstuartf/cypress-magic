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

export const unPickleBlob = (pickle: PickledBlob): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const { dataUri, size, type } = JSON.parse(pickle);
    if (size === 0) {
      // in this case the data URI will be invalid
      resolve(new Blob([], { type }));
      return;
    }
    try {
      const blob = dataUriToBlob(dataUri, type);
      resolve(blob);
    } catch (e) {
      console.log(e);
      reject(`error generating blob`);
    }
  });

// don't use fetch to read data URIs because some apps will block this
// also we should avoid using it and confusing the data tracking
function dataUriToBlob(dataUri: string, type: string) {
  const [_, data] = dataUri.split(",");
  const binaryData = atob(data);
  const byteNumbers = new Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteNumbers[i] = binaryData.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}

export const getBlobFileExtension = (blob: Blob): string => {
  const mimeInfo = mimeDb[blob.type];
  return mimeInfo && mimeInfo.extensions && mimeInfo.extensions.length
    ? mimeInfo.extensions[0]
    : "json";
};

export const aliasToFileName = (alias: string) => alias.replaceAll("/", "_");
