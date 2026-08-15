const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// resourceType lazima ilingane na jinsi faili ilivyopakiwa awali:
// 'image' kwa picha (default), 'raw' kwa PDF. Bila hii, Cloudinary
// inatafuta kwenye namespace ya 'image' pekee -> PDF (raw) haipatikani,
// destroy() inashindwa kimya (tunakamata error), na faili inabaki
// Cloudinary milele (storage leak) hata baada ya "kufutwa" DB.
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result !== 'ok' && result.result !== 'not found') {
      console.error(`Cloudinary delete haikufanikiwa (${publicId}, ${resourceType}):`, result.result);
    }
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

const uploadToCloudinary = async (filePath, folder, resourceType = 'image') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `mpendae-school/${folder}`,
    resource_type: resourceType,
  });
  return result;
};

module.exports = { cloudinary, deleteFromCloudinary, uploadToCloudinary };
