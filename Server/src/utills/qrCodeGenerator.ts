import QRCode from 'qrcode';

export const generateQRCodeImage = async (url: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCode;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}; 