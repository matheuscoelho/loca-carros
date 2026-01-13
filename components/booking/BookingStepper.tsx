'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface BookingStepperProps {
  currentStep: 1 | 2 | 3
  bookingId?: string
  carId?: string
}

const steps = [
  { id: 1, key: 'details', icon: '📋' },
  { id: 2, key: 'payment', icon: '💳' },
  { id: 3, key: 'confirmation', icon: '✅' },
]

export default function BookingStepper({ currentStep, bookingId, carId }: BookingStepperProps) {
  const t = useTranslations('booking')

  const getStepLink = (stepId: number) => {
    switch (stepId) {
      case 1:
        return carId ? `/booking/${carId}` : '#'
      case 2:
        return bookingId ? `/booking/checkout?bookingId=${bookingId}` : '#'
      case 3:
        return bookingId ? `/booking/confirmation?bookingId=${bookingId}` : '#'
      default:
        return '#'
    }
  }

  const canNavigate = (stepId: number) => {
    // Só pode voltar para steps anteriores, não avançar
    return stepId < currentStep
  }

  return (
    <div className="booking-stepper mb-4">
      <div className="stepper-container">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          const isClickable = canNavigate(step.id)

          return (
            <div key={step.id} className="stepper-item-wrapper">
              {/* Step */}
              <div className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isClickable ? (
                  <Link href={getStepLink(step.id)} className="stepper-link">
                    <div className="stepper-circle">
                      {isCompleted ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span>{step.icon}</span>
                      )}
                    </div>
                    <div className="stepper-label">
                      <span className="step-number">{t('step')} {step.id}</span>
                      <span className="step-title">{t(`steps.${step.key}`)}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="stepper-content">
                    <div className="stepper-circle">
                      {isCompleted ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span>{step.icon}</span>
                      )}
                    </div>
                    <div className="stepper-label">
                      <span className="step-number">{t('step')} {step.id}</span>
                      <span className="step-title">{t(`steps.${step.key}`)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`stepper-connector ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .booking-stepper {
          padding: 20px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .stepper-container {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 700px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .stepper-item-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .stepper-item-wrapper:last-child {
          flex: 0;
        }

        .stepper-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .stepper-link,
        .stepper-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: inherit;
          cursor: default;
        }

        .stepper-link {
          cursor: pointer;
        }

        .stepper-link:hover .stepper-circle {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .stepper-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: #e2e8f0;
          color: #64748b;
          transition: all 0.3s ease;
          border: 3px solid #e2e8f0;
        }

        .stepper-item.active .stepper-circle {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-color: #6366f1;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }

        .stepper-item.completed .stepper-circle {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .stepper-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 12px;
          text-align: center;
        }

        .step-number {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stepper-item.active .step-number {
          color: #6366f1;
        }

        .stepper-item.completed .step-number {
          color: #10b981;
        }

        .step-title {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-top: 2px;
        }

        .stepper-item.active .step-title {
          color: #1e293b;
        }

        .stepper-connector {
          flex: 1;
          height: 3px;
          background: #e2e8f0;
          margin: 0 8px;
          margin-bottom: 50px;
          border-radius: 2px;
          transition: background 0.3s ease;
        }

        .stepper-connector.completed {
          background: linear-gradient(90deg, #10b981 0%, #10b981 100%);
        }

        @media (max-width: 576px) {
          .stepper-container {
            padding: 0 10px;
          }

          .stepper-circle {
            width: 44px;
            height: 44px;
            font-size: 18px;
          }

          .step-title {
            font-size: 12px;
          }

          .step-number {
            font-size: 10px;
          }

          .stepper-connector {
            margin: 0 4px;
            margin-bottom: 40px;
          }
        }
      `}</style>
    </div>
  )
}
