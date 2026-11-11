'use client';
import React, { useState, useSyncExternalStore } from 'react';
import {
  calculateAsianBmi,
  classifyBloodPressure,
  classifyGlucose,
  classifyHeartRate,
} from '@/lib/vitals';
import {
  saveVitalsInputs,
  resetSession,
  getSessionSnapshot,
  getServerSessionSnapshot,
  subscribeSession,
  type VitalsInputState,
} from '@/lib/storage';

interface MatrixCardProps {
  label: string;
  value: string;
  status: string;
  color: string;
  subtitle: string;
  renderBack: (close: () => void) => React.ReactNode;
}

function MatrixCard({
  label,
  value,
  status,
  color,
  subtitle,
  renderBack,
}: MatrixCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.width / 2 - (e.clientX - rect.left)) / 15;
    const y = (rect.height / 2 - (e.clientY - rect.top)) / 15;
    setTilt({ x, y });
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className={`card-container ${isFlipped ? 'is-flipped' : ''}`}
      onClick={() => {
        if (!isFlipped) setIsFlipped(true);
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: isFlipped
          ? undefined
          : `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
    >
      <div className="card-inner">
        {/* FRONT: Cinematic Quantum Metric Display */}
        <div className="card-front glass-fx">
          <div className="front-header">
            <span className="label">{label}</span>
            <span className="flip-prompt">CALIBRATE ➔</span>
          </div>

          <div className="v-value" style={{ textShadow: `0 0 20px ${color}33` }}>
            {value}
          </div>

          <div className="front-footer">
            <div className="stat" style={{ color }}>
              <span className="stat-dot" style={{ backgroundColor: color }}></span>
              {status}
            </div>
            <div className="subtitle-text">{subtitle}</div>
          </div>
        </div>

        {/* BACK: Sovereign Calibration Vault */}
        <div
          className="card-back glass-fx"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="back-header">
            <span className="label">CLINICAL ENTRY: {label}</span>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsFlipped(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="back-content">
            {renderBack(() => setIsFlipped(false))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Vitals() {
  // Synchronous, reactive subscription to pakmed_session_v1 ledger
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const inputs = session.vitals;

  // Update helper that writes synchronously to localStorage
  const updateMetric = <K extends keyof VitalsInputState>(
    key: K,
    val: VitalsInputState[K],
  ) => {
    const nextInputs: VitalsInputState = {
      ...inputs,
      [key]: val,
    };
    saveVitalsInputs(nextInputs);
  };

  const handleReset = () => {
    resetSession();
  };

  // Instant pure calculations
  const bmiCalc = calculateAsianBmi(inputs.bmi.weightKg, inputs.bmi.heightCm);
  const bpCalc = classifyBloodPressure(inputs.bp.systolic, inputs.bp.diastolic);
  const glucoseCalc = classifyGlucose(
    inputs.glucose.value,
    inputs.glucose.context,
  );
  const hrCalc = classifyHeartRate(inputs.hr.bpm);

  return (
    <div className="vitals-wrapper">
      {/* LEDGER STATUS BAR */}
      <div className="ledger-bar">
        <div className="ledger-status">
          <span className="ledger-pulse"></span>
          <span className="ledger-text">LEDGER ACTIVE: pakmed_session_v1</span>
        </div>
        <button type="button" onClick={handleReset} className="ledger-reset-btn">
          RESET DEFAULTS
        </button>
      </div>

      {/* VITALS MATRIX GRID */}
      <div className="vitals-matrix">
        {/* 1. ADULT ASIAN BMI */}
        <MatrixCard
          label="BMI (ASIAN CRITERIA)"
          value={bmiCalc.formatted}
          status={bmiCalc.status}
          color={bmiCalc.color}
          subtitle={`${inputs.bmi.weightKg} kg / ${inputs.bmi.heightCm} cm (${bmiCalc.category})`}
          renderBack={(close) => (
            <div className="form-stack">
              <div className="input-group">
                <label>WEIGHT (KG)</label>
                <div className="stepper-row">
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() =>
                      updateMetric('bmi', {
                        ...inputs.bmi,
                        weightKg: Math.max(20, Math.round((inputs.bmi.weightKg - 0.5) * 10) / 10),
                      })
                    }
                  >
                    –
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    max="250"
                    value={inputs.bmi.weightKg}
                    onChange={(e) =>
                      updateMetric('bmi', {
                        ...inputs.bmi,
                        weightKg: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="vault-field"
                  />
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() =>
                      updateMetric('bmi', {
                        ...inputs.bmi,
                        weightKg: Math.round((inputs.bmi.weightKg + 0.5) * 10) / 10,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>HEIGHT (CM)</label>
                <div className="stepper-row">
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() =>
                      updateMetric('bmi', {
                        ...inputs.bmi,
                        heightCm: Math.max(50, inputs.bmi.heightCm - 1),
                      })
                    }
                  >
                    –
                  </button>
                  <input
                    type="number"
                    step="1"
                    min="50"
                    max="250"
                    value={inputs.bmi.heightCm}
                    onChange={(e) =>
                      updateMetric('bmi', {
                        ...inputs.bmi,
                        heightCm: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="vault-field"
                  />
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() =>
                      updateMetric('bmi', {
                        ...inputs.bmi,
                        heightCm: inputs.bmi.heightCm + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="calc-preview" style={{ color: bmiCalc.color }}>
                Output: {bmiCalc.formatted} kg/m² • {bmiCalc.category}
              </div>

              <button type="button" className="confirm-btn" onClick={close}>
                CONFIRM & SYNC
              </button>
            </div>
          )}
        />

        {/* 2. BLOOD PRESSURE */}
        <MatrixCard
          label="BLOOD PRESSURE"
          value={bpCalc.formatted}
          status={bpCalc.status}
          color={bpCalc.color}
          subtitle={`AHA/ACC: ${bpCalc.stage}`}
          renderBack={(close) => (
            <div className="form-stack">
              <div className="dual-inputs">
                <div className="input-group">
                  <label>SYS (MMHG)</label>
                  <input
                    type="number"
                    min="50"
                    max="260"
                    value={inputs.bp.systolic}
                    onChange={(e) =>
                      updateMetric('bp', {
                        ...inputs.bp,
                        systolic: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="vault-field"
                  />
                </div>

                <div className="input-group">
                  <label>DIA (MMHG)</label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    value={inputs.bp.diastolic}
                    onChange={(e) =>
                      updateMetric('bp', {
                        ...inputs.bp,
                        diastolic: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="vault-field"
                  />
                </div>
              </div>

              <div className="calc-preview" style={{ color: bpCalc.color }}>
                Staging: {bpCalc.stage} ({bpCalc.status})
              </div>

              <button type="button" className="confirm-btn" onClick={close}>
                CONFIRM & SYNC
              </button>
            </div>
          )}
        />

        {/* 3. GLUCOSE LEVEL */}
        <MatrixCard
          label="BLOOD GLUCOSE"
          value={glucoseCalc.formatted}
          status={glucoseCalc.status}
          color={glucoseCalc.color}
          subtitle={`${inputs.glucose.context.toUpperCase()}: ${glucoseCalc.category} mg/dL`}
          renderBack={(close) => (
            <div className="form-stack">
              <div className="input-group">
                <label>STATE / PROTOCOL</label>
                <div className="toggle-group">
                  <button
                    type="button"
                    className={`toggle-btn ${
                      inputs.glucose.context === 'fasting' ? 'active' : ''
                    }`}
                    onClick={() =>
                      updateMetric('glucose', {
                        ...inputs.glucose,
                        context: 'fasting',
                      })
                    }
                  >
                    FASTING
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${
                      inputs.glucose.context === 'postprandial' ? 'active' : ''
                    }`}
                    onClick={() =>
                      updateMetric('glucose', {
                        ...inputs.glucose,
                        context: 'postprandial',
                      })
                    }
                  >
                    POSTPRANDIAL
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>READING (MG/DL)</label>
                <input
                  type="number"
                  min="30"
                  max="600"
                  value={inputs.glucose.value}
                  onChange={(e) =>
                    updateMetric('glucose', {
                      ...inputs.glucose,
                      value: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="vault-field"
                />
              </div>

              <div className="calc-preview" style={{ color: glucoseCalc.color }}>
                Classification: {glucoseCalc.category} ({glucoseCalc.status})
              </div>

              <button type="button" className="confirm-btn" onClick={close}>
                CONFIRM & SYNC
              </button>
            </div>
          )}
        />

        {/* 4. HEART RATE */}
        <MatrixCard
          label="HEART RATE"
          value={hrCalc.formatted}
          status={hrCalc.status}
          color={hrCalc.color}
          subtitle={`PULSE: ${inputs.hr.bpm} BPM (${hrCalc.category})`}
          renderBack={(close) => (
            <div className="form-stack">
              <div className="input-group">
                <label>RESTING PULSE (BPM)</label>
                <div className="stepper-row">
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() =>
                      updateMetric('hr', {
                        bpm: Math.max(30, inputs.hr.bpm - 1),
                      })
                    }
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min="30"
                    max="240"
                    value={inputs.hr.bpm}
                    onChange={(e) =>
                      updateMetric('hr', {
                        bpm: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="vault-field"
                  />
                  <button
                    type="button"
                    className="step-btn"
                    onClick={() =>
                      updateMetric('hr', {
                        bpm: inputs.hr.bpm + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="calc-preview" style={{ color: hrCalc.color }}>
                Output: {hrCalc.status} ({hrCalc.category})
              </div>

              <button type="button" className="confirm-btn" onClick={close}>
                CONFIRM & SYNC
              </button>
            </div>
          )}
        />
      </div>

      <style jsx global>{`
        .vitals-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 920px;
          margin: auto;
        }

        .ledger-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 18px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          backdrop-filter: blur(20px);
        }

        .ledger-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ledger-pulse {
          width: 8px;
          height: 8px;
          background-color: #00e5ff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00e5ff;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .ledger-text {
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: #94a3b8;
          font-weight: 700;
        }

        .ledger-reset-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: 0.2s;
        }

        .ledger-reset-btn:hover {
          color: #ff1744;
          border-color: #ff1744;
        }

        .vitals-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
        }

        .card-container {
          height: 270px;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .is-flipped .card-inner {
          transform: rotateY(180deg);
        }

        .glass-fx {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          background: rgba(10, 15, 30, 0.55);
          backdrop-filter: blur(50px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .card-front:hover {
          border-color: rgba(0, 229, 255, 0.3);
          box-shadow: 0 10px 35px rgba(0, 229, 255, 0.08);
        }

        .front-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .flip-prompt {
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: #3d5afe;
          font-weight: 700;
          opacity: 0.8;
        }

        .card-front:hover .flip-prompt {
          color: #00e5ff;
        }

        .label {
          font-size: 0.6rem;
          letter-spacing: 3px;
          color: #94a3b8;
          font-weight: 800;
        }

        .v-value {
          font-size: 3.4rem;
          font-weight: 900;
          color: white;
          letter-spacing: -2px;
          text-align: center;
          margin: auto 0;
        }

        .front-footer {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .stat-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .subtitle-text {
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* BACK FACE */
        .card-back {
          background: rgba(5, 8, 18, 0.96);
          transform: rotateY(180deg);
          border: 1px solid rgba(61, 90, 254, 0.4);
        }

        .back-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1rem;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .close-btn:hover {
          color: #ff1744;
        }

        .back-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 100%;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-group label {
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: #94a3b8;
          font-weight: 800;
        }

        .stepper-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .step-btn {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.15s;
        }

        .step-btn:hover {
          background: #3d5afe;
          border-color: #3d5afe;
        }

        .vault-field {
          flex: 1;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          outline: none;
          text-align: center;
          font-family: inherit;
        }

        .vault-field:focus {
          border-color: #00e5ff;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }

        .dual-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .toggle-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .toggle-btn {
          padding: 7px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #64748b;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.2s;
        }

        .toggle-btn.active {
          background: rgba(61, 90, 254, 0.25);
          border-color: #3d5afe;
          color: #00e5ff;
        }

        .calc-preview {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-align: center;
          margin-top: auto;
          padding: 4px;
        }

        .confirm-btn {
          width: 100%;
          background: #3d5afe;
          color: white;
          border: none;
          padding: 9px;
          border-radius: 10px;
          font-weight: 900;
          font-size: 0.68rem;
          letter-spacing: 2px;
          cursor: pointer;
          transition: 0.2s;
        }

        .confirm-btn:hover {
          background: #2945ff;
          box-shadow: 0 0 20px rgba(61, 90, 254, 0.4);
        }
      `}</style>
    </div>
  );
}
