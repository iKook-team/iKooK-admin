const assetUrl = 'https://ikook.s3.us-east-1.amazonaws.com';

const Constants = {
  assetUrl,
  menuUrl: `${assetUrl}/menus`,
  userUrl: `${assetUrl}/users`,
  verificationUrl: `${assetUrl}/verification`,
  getAssetUrl: (asset: string, type: AssetType) => {
    if (!asset) {
      return undefined;
    }
    if (asset.startsWith('http')) {
      return asset;
    }
    switch (type) {
      case 'menus':
        return `${Constants.menuUrl}/${asset}`;
      case 'users':
        return `${Constants.userUrl}/${asset}`;
      case 'verification':
        return `${Constants.verificationUrl}/${asset}`;
    }
  },
  getDicebearUrl: (name: string) => {
    return 'https://api.dicebear.com/9.x/initials/svg?seed=' + encodeURI(name);
  },
  getImageUrl: (image: string, type: AssetType, fallback: string | null = null) => {
    const assetUrl = Constants.getAssetUrl(image, type);
    return assetUrl ?? Constants.getDicebearUrl(fallback ?? type);
  }
};

type AssetType = 'menus' | 'users' | 'verification';

export default Constants;
