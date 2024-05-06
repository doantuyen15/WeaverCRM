require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    tool: "notarytool", // thêm
    appBundleId: 'vn.altisss.premium',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: 'altissssolution@gmail.com',
    appleIdPassword: 'lpcd-bkzi-izro-ljya',
    ascProvider: '3894P43295',
    teamId: '3894P43295' // thêm 
  });
};