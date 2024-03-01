require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'vn.altisss.premium',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: 'altissssolution@gmail.com',
    appleIdPassword: 'qjrr-dwci-mpqy-fgzg',
    ascProvider: '3894P43295'
  });
};