'use client'

import toast, { Toaster, ToastOptions } from 'react-hot-toast'

// Estilos customizados para os toasts
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
}

// Toast de sucesso
export const toastSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
    style: {
      background: '#10b981',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  })
}

// Toast de erro
export const toastError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    duration: 5000,
    ...options,
    style: {
      background: '#ef4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  })
}

// Toast de informação
export const toastInfo = (message: string, options?: ToastOptions) => {
  toast(message, {
    ...defaultOptions,
    ...options,
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
    },
  })
}

// Toast de aviso
export const toastWarning = (message: string, options?: ToastOptions) => {
  toast(message, {
    ...defaultOptions,
    ...options,
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
    },
  })
}

// Toast de loading (retorna o ID para poder fechar depois)
export const toastLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#1f2937',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
    },
  })
}

// Fechar um toast específico
export const toastDismiss = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId)
  } else {
    toast.dismiss()
  }
}

// Toast de confirmação customizado
export const toastConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  toast(
    (t) => (
      <div className="d-flex flex-column gap-2">
        <span>{message}</span>
        <div className="d-flex gap-2 justify-content-end">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              toast.dismiss(t.id)
              onCancel?.()
            }}
          >
            Cancelar
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              toast.dismiss(t.id)
              onConfirm()
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#1f2937',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxWidth: '400px',
      },
    }
  )
}

// Componente Toaster para adicionar ao layout
export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 80,
        zIndex: 9999,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      }}
    />
  )
}

export default toast
