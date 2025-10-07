'use client'

import { useEffect, useState } from 'react'

export default function FlowiseChatbot() {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [BubbleChat, setBubbleChat] = useState<React.ComponentType<Record<string, unknown>> | null>(null)

  useEffect(() => {
    // Asegurar que solo se ejecute en el cliente
    setIsClient(true)
    
    // Importar dinámicamente para evitar problemas de SSR
    const loadBubbleChat = async () => {
      try {
        const { BubbleChat: BC } = await import('flowise-embed-react')
        setBubbleChat(() => BC)
      } catch (error) {
        console.warn('Flowise chatbot could not be loaded:', error)
      }
    }
    
    loadBubbleChat()
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // No renderizar hasta que estemos en el cliente y el componente esté cargado
  if (!isClient || !BubbleChat) {
    return null
  }

  return (
    <BubbleChat
      chatflowid="f3ae519d-89c5-4704-ac2f-788e55876421"
      apiHost="https://flowise-1032065525651.us-central1.run.app"
      chatflowConfig={{
        /* Chatflow Config */
      }}
      observersConfig={{
        /* Observers Config */
      }}
      theme={{    
        button: {
          backgroundColor: '#0F766E', // Teal-700 para coincidir con el tema de la app
          right: 20,
          bottom: 20,
          size: isMobile ? 56 : 48, // Más grande en móvil para mejor usabilidad
          dragAndDrop: true,
          iconColor: 'white',
          customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
          autoWindowOpen: {
            autoOpen: true,
            openDelay: 2,
            autoOpenOnMobile: false // Deshabilitado en móvil para mejor UX
          }
        },
        tooltip: {
          showTooltip: true,
          tooltipMessage: '¡Hola! 👋 ¿En qué puedo ayudarte?',
          tooltipBackgroundColor: '#0F766E',
          tooltipTextColor: 'white',
          tooltipFontSize: isMobile ? 14 : 16
        },
        disclaimer: {
          title: 'Términos de Uso',
          message: "Al usar este chatbot, aceptas nuestros <a target=\"_blank\" href=\"https://flowiseai.com/terms\">Términos y Condiciones</a>",
          textColor: 'black',
          buttonColor: '#0F766E',
          buttonText: 'Comenzar Chat',
          buttonTextColor: 'white',
          blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
          backgroundColor: 'white'
        },
        customCSS: `
          /* Estilos personalizados para mejor integración */
          .flowise-chatbot {
            z-index: 1000 !important;
          }
          
          @media (max-width: 768px) {
            .flowise-chatbot .chat-window {
              width: 100vw !important;
              height: 100vh !important;
              max-width: none !important;
              max-height: none !important;
              border-radius: 0 !important;
            }
          }
        `,
        chatWindow: {
          showTitle: true,
          showAgentMessages: true,
          title: 'Centinela Assistant',
          titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
          welcomeMessage: '¡Hola! Soy tu asistente de Centinela. ¿En qué puedo ayudarte hoy?',
          errorMessage: 'Lo siento, hubo un error. Por favor, inténtalo de nuevo.',
          backgroundColor: '#ffffff',
          backgroundImage: '',
          height: isMobile ? '100vh' : 700, // Pantalla completa en móvil
          width: isMobile ? '100vw' : 400, // Pantalla completa en móvil
          fontSize: isMobile ? 14 : 16,
          starterPrompts: [
            "¿Cómo puedo crear una nueva tarea?",
            "¿Qué es el análisis de riesgo?",
            "¿Cómo subo fotos o videos?",
            "¿Cuál es el estado de mis tareas?"
          ],
          starterPromptFontSize: isMobile ? 13 : 15,
          clearChatOnReload: false,
          sourceDocsTitle: 'Fuentes:',
          renderHTML: true,
          botMessage: {
            backgroundColor: '#F0FDFA', // Teal-50
            textColor: '#134E4A', // Teal-800
            showAvatar: true,
            avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png'
          },
          userMessage: {
            backgroundColor: '#0F766E', // Teal-700
            textColor: '#ffffff',
            showAvatar: true,
            avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
          },
          textInput: {
            placeholder: 'Escribe tu pregunta aquí...',
            backgroundColor: '#ffffff',
            textColor: '#303235',
            sendButtonColor: '#0F766E',
            maxChars: 500, // Aumentado para permitir preguntas más largas
            maxCharsWarningMessage: 'Has excedido el límite de caracteres. Por favor, escribe menos de 500 caracteres.',
            autoFocus: false, // Deshabilitado para mejor UX en móvil
            sendMessageSound: true,
            sendSoundLocation: 'send_message.mp3',
            receiveMessageSound: true,
            receiveSoundLocation: 'receive_message.mp3'
          },
          feedback: {
            color: '#0F766E'
          },
          dateTimeToggle: {
            date: true,
            time: true
          },
          footer: {
            textColor: '#6B7280',
            text: 'Desarrollado por',
            company: 'Centinela',
            companyLink: '#'
          }
        }
      }}
    />
  )
}
