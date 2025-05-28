'use client'

import { motion } from 'framer-motion'
import { Clock, Zap } from 'lucide-react'

interface SweepstakeTimerProps {
  timeLeft: number // em segundos
}

export function SweepstakeTimer({ timeLeft }: SweepstakeTimerProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    }
  }

  const time = formatTime(timeLeft)
  const isUrgent = timeLeft < 300 // Menos de 5 minutos
  const isCritical = timeLeft < 60 // Menos de 1 minuto

  return (
    <div className={`sweepstake-timer ${isUrgent ? 'urgent' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="sweepstake-timer-header">
        <div className="sweepstake-timer-icon">
          {isCritical ? (
            <Zap className="w-6 h-6 text-red-400" />
          ) : (
            <Clock className="w-6 h-6 text-chronos-gold" />
          )}
        </div>
        <h3 className="sweepstake-timer-title">
          {isCritical ? 'ÚLTIMOS SEGUNDOS!' : isUrgent ? 'Tempo Esgotando!' : 'Tempo Restante'}
        </h3>
      </div>

      <div className="sweepstake-timer-display">
        <motion.div
          key={time.hours}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sweepstake-timer-unit"
        >
          <span className="sweepstake-timer-number">
            {time.hours}
          </span>
          <span className="sweepstake-timer-label">
            Horas
          </span>
        </motion.div>

        <div className="sweepstake-timer-separator">:</div>

        <motion.div
          key={time.minutes}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sweepstake-timer-unit"
        >
          <span className="sweepstake-timer-number">
            {time.minutes}
          </span>
          <span className="sweepstake-timer-label">
            Minutos
          </span>
        </motion.div>

        <div className="sweepstake-timer-separator">:</div>

        <motion.div
          key={time.seconds}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sweepstake-timer-unit"
        >
          <span className="sweepstake-timer-number">
            {time.seconds}
          </span>
          <span className="sweepstake-timer-label">
            Segundos
          </span>
        </motion.div>
      </div>

      {timeLeft === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sweepstake-timer-finished"
        >
          <h2 className="sweepstake-timer-finished-title">
            🎉 Sorteio Finalizado!
          </h2>
          <p className="sweepstake-timer-finished-text">
            Aguarde o resultado...
          </p>
        </motion.div>
      )}

      {/* Progress Ring */}
      <div className="sweepstake-timer-ring">
        <svg className="sweepstake-timer-svg" viewBox="0 0 100 100">
          <circle
            className="sweepstake-timer-ring-bg"
            cx="50"
            cy="50"
            r="45"
          />
          <motion.circle
            className="sweepstake-timer-ring-progress"
            cx="50"
            cy="50"
            r="45"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: timeLeft / 5400 }} // Assumindo 1h30m total
            transition={{ duration: 1 }}
          />
        </svg>
      </div>
    </div>
  )
}
