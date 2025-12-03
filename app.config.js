export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});


const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.nickjuma.d2dapp.dev';
  }

  if (IS_PREVIEW) {
    return 'com.nickjuma.d2dapp.preview';
  }

  return 'com.nickjums.d2dapp';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'd2dapp (Dev)';
  }

  if (IS_PREVIEW) {
    return 'd2dapp';
  }

  return 'd2dapp (Work)';
};
