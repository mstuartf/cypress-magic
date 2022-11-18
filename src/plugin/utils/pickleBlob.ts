import mimeDb from "mime-db";

export const pickleBlob = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      resolve(JSON.stringify({ blob: reader.result }));
    };
  });

export const blobify = (value: object): Blob => {
  return new Blob([JSON.stringify(value)], { type: "application/json" });
};

export const unPickleBlob = (
  name: string,
  pickle: string
): Promise<{ name: string; blob: Blob }> =>
  new Promise((resolve, reject) => {
    const parsed = JSON.parse(pickle);
    fetch(parsed.blob)
      .then((res) => res.blob().then((blob) => resolve({ name, blob })))
      .catch(() => {
        reject(`error generating ${name}`);
      });
  });

export const unPickleFixtures = (
  fixtures: [string, string][]
): Promise<{ name: string; blob: Blob }[]> => {
  const promises = fixtures.map(([k, v]) => unPickleBlob(k, v));
  return Promise.all(promises);
};

export const getBlobFileExtension = (blob: Blob): string => {
  const mimeInfo = mimeDb[blob.type];
  return mimeInfo && mimeInfo.extensions && mimeInfo.extensions.length
    ? mimeInfo.extensions[0]
    : "json";
};
