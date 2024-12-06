import { put } from '@vercel/blob';
import { handleResponse } from '../../utils/apiHelpers';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(req) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return handleResponse({
        error: 'Blob storage not configured',
        status: 500
      });
    }

    const { image, filename } = await req.json();

    if (!image || !filename) {
      return handleResponse({
        error: 'Missing required fields',
        status: 400
      });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    // Upload to Vercel Blob
    const { url } = await put(
      `products/${filename}`,
      imageBuffer,
      {
        access: 'public',
        contentType: 'image/jpeg'
      }
    );

    return handleResponse({
      data: { url },
      status: 200
    });
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return handleResponse({
      error: 'Failed to upload image',
      status: 500
    });
  }
}
