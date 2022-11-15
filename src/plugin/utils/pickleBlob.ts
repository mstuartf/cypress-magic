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
  new Promise((resolve) => {
    const parsed = JSON.parse(pickle);
    fetch(parsed.blob).then((res) =>
      res.blob().then((blob) => resolve({ name, blob }))
    );
  });

export const unPickleFixtures = (fixtures: {
  [path: string]: string;
}): Promise<{ name: string; blob: Blob }[]> => {
  const promises = Object.entries(fixtures).map(([k, v]) => unPickleBlob(k, v));
  return Promise.all(promises);
};
