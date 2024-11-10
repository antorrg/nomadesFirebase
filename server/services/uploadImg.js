import Busboy from 'busboy';
import path from 'path';
import os from 'os';
import fs from 'fs';
import sharp from 'sharp';
import { storage } from '../firebase.js';

const uploadController = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        message: 'Método no permitido' 
      });
    }

    const busboy = Busboy({ 
      headers: req.headers,
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
      }
    });

    let uploadPromise = new Promise((resolve, reject) => {
      const tmpdir = os.tmpdir();
      let fileBuffer = null;
      let originalname = '';

      busboy.on('file', (fieldname, file, { filename, mimeType }) => {
        if (!mimeType.startsWith('image/')) {
          reject(new Error('Solo se permiten archivos de imagen'));
          file.resume();
          return;
        }

        originalname = filename;
        const chunks = [];

        file.on('data', (chunk) => {
          chunks.push(chunk);
        });

        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      busboy.on('finish', () => {
        if (!fileBuffer) {
          reject(new Error('No se proporcionó ningún archivo'));
          return;
        }
        resolve({ fileBuffer, originalname });
      });

      busboy.on('error', (error) => {
        reject(new Error(`Error en la carga: ${error.message}`));
      });

      if (req.rawBody) {
        busboy.end(req.rawBody);
      } else {
        req.pipe(busboy);
      }
    });

    const { fileBuffer, originalname } = await uploadPromise;

    // Convertir a WebP usando sharp directamente con el buffer
    const webpBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Subir el buffer WebP a Firebase
    const fileName = `${Date.now()}-${path.parse(originalname).name}.webp`;
    const filePath = `images/${fileName}`;
    
    const file = storage.file(filePath);
    await file.save(webpBuffer, {
      metadata: {
        contentType: 'image/webp',
        metadata: {
          originalname: originalname
        }
      }
    });

    // Hacer el archivo público
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${storage.name}/${filePath}`;

    return res.status(200).json({
      success: true,
      message: 'Imagen convertida y subida exitosamente',
      url: publicUrl
    });

  } catch (error) {
    console.error('Error en uploadController:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error al procesar la imagen'
    });
  }
};

export default uploadController;