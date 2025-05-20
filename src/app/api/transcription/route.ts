import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};

// OpenAI Whisper API has a 25MB file size limit
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'Archivo demasiado grande', 
          details: `El archivo es de ${fileSizeMB} MB. El tamaño máximo permitido es 25 MB.`,
          recommendations: [
            'Considere comprimir el archivo',
            'Recorte el audio/video a una duración más corta',
            'Reduzca la calidad del audio'
          ] 
        },
        { status: 413 }
      );
    }

    // Create a new FormData instance for the OpenAI API
    const openAIFormData = new FormData();
    
    // Convert the File to a Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Add the file to the form data
    openAIFormData.append('file', fileBuffer, {
      filename: file.name,
      contentType: file.type,
    });
    
    // Add the model parameter
    openAIFormData.append('model', 'whisper-1');
    
    // Get language from form data or default to Spanish
    const language = formData.get('language') as string || 'es';
    openAIFormData.append('language', language);

    // Log file information for debugging
    console.log(`Procesando archivo: ${file.name}, Tamaño: ${fileSizeMB} MB, Tipo: ${file.type}`);

    try {
      // Call the OpenAI API
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', openAIFormData, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log successful response
      console.log('Respuesta de OpenAI API exitosa');
      
      // Ensure we're returning the expected format with a text property
      const transcriptionResult = response.data;
      return NextResponse.json(transcriptionResult);
    } catch (apiError: any) {
      // Handle API errors with detailed information
      console.error('Error de OpenAI API:', apiError.message);
      
      // Extract detailed error information
      const status = apiError.response?.status || 500;
      const errorDetails = apiError.response?.data || {};
      
      let errorMessage = 'Error en la API de OpenAI';
      let recommendations: string[] = [];
      
      // Provide specific error messages based on status codes
      if (status === 413) {
        errorMessage = 'Archivo demasiado grande para la API de OpenAI (máximo 25 MB)';
        recommendations = [
          'Comprima el archivo a un formato más eficiente',
          'Recorte el audio/video a una duración más corta',
          'Reduzca la calidad del audio'
        ];
      } else if (status === 429) {
        errorMessage = 'Límite de tasa excedido o cuota alcanzada';
        recommendations = [
          'Intente nuevamente más tarde',
          'Contacte al administrador si el problema persiste'
        ];
      } else if (status === 400) {
        errorMessage = 'Solicitud incorrecta - el archivo puede estar corrupto o en un formato no compatible';
        recommendations = [
          'Verifique que el formato del archivo sea compatible (MP3, MP4, WAV, etc.)',
          'Intente convertir el archivo a otro formato'
        ];
      } else if (status === 401) {
        errorMessage = 'Error de autenticación - verifique su clave API';
        recommendations = [
          'Contacte al administrador del sistema'
        ];
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: errorDetails,
          status: status,
          fileInfo: {
            name: file.name,
            size: `${fileSizeMB} MB`,
            type: file.type
          },
          recommendations: recommendations
        },
        { status: status }
      );
    }
  } catch (error: any) {
    // Handle general errors
    console.error('Error de transcripción:', error.message);
    return NextResponse.json(
      { 
        error: 'Error al procesar la transcripción', 
        message: error.message || 'Error desconocido',
        recommendations: [
          'Verifique que el archivo no esté corrupto',
          'Intente con un archivo diferente',
          'Si el problema persiste, contacte al soporte técnico'
        ]
      },
      { status: 500 }
    );
  }
}