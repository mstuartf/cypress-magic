const utils = {
  throwErrByPath: (message: string, args?: any) => {
    console.error(message);
    throw Error(message);
  },
};
export default utils;
