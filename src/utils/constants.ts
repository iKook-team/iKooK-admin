const assetUrl = 'https://ikook.s3.us-east-1.amazonaws.com';
const Constants = {
  assetUrl,
  menuUrl: `${assetUrl}/menus`,
  userUrl: `${assetUrl}/users`,
  verificationUrl: `${assetUrl}/verification`,
  getAssetUrl: (image: string, type: 'menus' | 'users' | 'verification') => {
    if (!image) {
      console.warn('getAssetUrl called with an undefined or null image');
      return ''; // Return an empty string or a placeholder URL if needed
    }
    if (image.startsWith('http')) {
      return image;
    }
    switch (type) {
      case 'menus':
        return `${Constants.menuUrl}/${image}`;
      case 'users':
        return `${Constants.userUrl}/${image}`;
      case 'verification':
        return `${Constants.verificationUrl}/${image}`;
    }
  }
};

export default Constants;
