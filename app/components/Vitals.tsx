'use client';
import React, { useState, useSyncExternalStore } from 'react';
import {
  calculateAsianBmi,
  centimetresToFeetInches,
  classifyBloodPressure,
  classifyGlucose,
  classifyHeartRate,
  feetInchesToCentimetres,
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
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft-in'>('cm');
  const [heightDraft, setHeightDraft] = useState({ feet: '', inches: '' });
  const [imperialDraftDirty, setImperialDraftDirty] = useState(false);

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

  const feetValue = Number(heightDraft.feet);
  const inchesValue = Number(heightDraft.inches);
  let convertedDraftCm: number | null = null;
  let conversionError = false;
  const feetInchesFieldsValid = (
    heightDraft.feet.trim() !== '' &&
    heightDraft.inches.trim() !== '' &&
    Number.isInteger(feetValue) && feetValue >= 0 &&
    Number.isFinite(inchesValue) && inchesValue >= 0 && inchesValue < 12 &&
    (feetValue > 0 || inchesValue > 0)
  );
  if (feetInchesFieldsValid) {
    try {
      convertedDraftCm = feetInchesToCentimetres(feetValue, inchesValue);
    } catch {
      conversionError = true;
    }
  }
  const imperialDraftInvalid = imperialDraftDirty && (!feetInchesFieldsValid || convertedDraftCm === null);
  const bmiInputsValid = [inputs.bmi.weightKg, inputs.bmi.heightCm].every(
    (value) => Number.isFinite(value) && value > 0,
  );
  const bmiValid = bmiInputsValid && !imperialDraftInvalid;
  const bpValid = [inputs.bp.systolic, inputs.bp.diastolic].every(
    (value) => Number.isFinite(value) && value > 0,
  );
  const glucoseValid = Number.isFinite(inputs.glucose.value) && inputs.glucose.value > 0;
  const hrValid = Number.isFinite(inputs.hr.bpm) && inputs.hr.bpm > 0;

  // Guard calculations so malformed numeric extremes produce feedback, not a render crash.
  let bmiCalc = null as ReturnType<typeof calculateAsianBmi> | null;
  let bmiCalculationError = false;
  if (bmiValid) {
    try {
      bmiCalc = calculateAsianBmi(inputs.bmi.weightKg, inputs.bmi.heightCm);
    } catch {
      bmiCalculationError = true;
    }
  }
  const bpCalc = bpValid ? classifyBloodPressure(inputs.bp.systolic, inputs.bp.diastolic) : null;
  const glucoseCalc = glucoseValid
    ? classifyGlucose(inputs.glucose.value, inputs.glucose.context)
    : null;
  const hrCalc = hrValid ? classifyHeartRate(inputs.hr.bpm) : null;
  const neutralColor = '#94a3b8';

  const changeHeightUnit = (unit: 'cm' | 'ft-in') => {
    if (unit === 'ft-in' && !imperialDraftDirty && Number.isFinite(inputs.bmi.heightCm) && inputs.bmi.heightCm > 0) {
      const converted = centimetresToFeetInches(inputs.bmi.heightCm);
      setHeightDraft({ feet: String(converted.feet), inches: String(Number(converted.inches.toFixed(8))) });
    }
    setHeightUnit(unit);
  };

  const updateFeetInches = (next: { feet: string; inches: string }) => {
    setHeightDraft(next);
    setImperialDraftDirty(true);
    const feet = Number(next.feet);
    const inches = Number(next.inches);
    if (
      next.feet.trim() !== '' && next.inches.trim() !== '' &&
      Number.isInteger(feet) && feet >= 0 &&
      Number.isFinite(inches) && inches >= 0 && inches < 12 &&
      (feet > 0 || inches > 0)
    ) {
      try {
        updateMetric('bmi', {
          ...inputs.bmi,
          heightCm: feetInchesToCentimetres(feet, inches),
        });
        setImperialDraftDirty(false);
      } catch {
        // Keep the draft visible and invalid; feedback is derived during render.
      }
    }
  };

  const discardImperialDraft = () => {
    setImperialDraftDirty(false);
    if (Number.isFinite(inputs.bmi.heightCm) && inputs.bmi.heightCm > 0) {
      const converted = centimetresToFeetInches(inputs.bmi.heightCm);
      setHeightDraft({ feet: String(converted.feet), inches: String(Number(converted.inches.toFixed(8))) });
    }
  };

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
          value={bmiCalc?.formatted ?? '—'}
          status={bmiCalc?.status ?? 'INVALID INPUT'}
          color={bmiCalc?.color ?? neutralColor}
          subtitle={bmiCalc
            ? `${inputs.bmi.weightKg} kg / ${inputs.bmi.heightCm} cm (${bmiCalc.category})`
            : 'Enter positive finite weight and height'}
          renderBack={(close) => (
            <div className="form-stack">
              <div className="input-group">
                <label htmlFor="bmi-weight-kg">WEIGHT (KG)</label>
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
                    id="bmi-weight-kg"
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
                <label>HEIGHT UNITS</label>
                <div className="toggle-group">
                  <button type="button" className={`toggle-btn ${heightUnit === 'ft-in' ? 'active' : ''}`} onClick={() => changeHeightUnit('ft-in')}>FEET &amp; INCHES</button>
                  <button type="button" className={`toggle-btn ${heightUnit === 'cm' ? 'active' : ''}`} onClick={() => changeHeightUnit('cm')}>CENTIMETRES</button>
                </div>
              </div>

              {heightUnit === 'cm' ? <div className="input-group">
                <label htmlFor="bmi-height-cm">HEIGHT (CM)</label>
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
                    id="bmi-height-cm"
                    type="number"
                    step="1"
                    value={inputs.bmi.heightCm}
                    onChange={(e) =>
                      updateMetric('bmi', {
                        ...inputs.bmi,
                        heightCm: Number(e.target.value) || 0,
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
              </div> : <div className="dual-inputs">
                <div className="input-group">
                  <label htmlFor="bmi-height-feet">HEIGHT (FEET)</label>
                  <input id="bmi-height-feet" type="number" min="0" step="1" value={heightDraft.feet} onChange={(e) => updateFeetInches({ ...heightDraft, feet: e.target.value })} className="vault-field" />
                </div>
                <div className="input-group">
                  <label htmlFor="bmi-height-inches">HEIGHT (INCHES, 0–&lt;12)</label>
                  <input id="bmi-height-inches" type="number" min="0" step="any" value={heightDraft.inches} onChange={(e) => updateFeetInches({ ...heightDraft, inches: e.target.value })} className="vault-field" />
                </div>
              </div>}

              {imperialDraftInvalid && heightUnit === 'cm' && (
                <div className="calc-preview" role="alert">
                  The unfinished feet-and-inches height is still invalid. Return to feet and inches to correct it, or discard that draft to use the last saved centimetre height.
                  <button type="button" className="confirm-btn" onClick={discardImperialDraft}>DISCARD FEET &amp; INCHES DRAFT</button>
                </div>
              )}

              <div className="calc-preview" style={{ color: bmiCalc?.color ?? neutralColor }} role="status" aria-live="polite">
                {bmiCalc
                  ? `Output: ${bmiCalc.formatted} kg/m² • ${bmiCalc.category}`
                  : imperialDraftInvalid
                    ? conversionError
                      ? 'This feet-and-inches value cannot convert to a finite positive centimetre height. Correct the fields.'
                      : 'Enter whole non-negative feet and inches from zero to less than twelve; total height must be greater than zero.'
                    : bmiCalculationError
                      ? 'These measurements cannot produce a finite positive BMI. Correct the height or weight.'
                      : 'Enter a finite weight and height greater than zero to calculate BMI.'}
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
          value={bpCalc?.formatted ?? '—'}
          status={bpCalc?.status ?? 'INVALID INPUT'}
          color={bpCalc?.color ?? neutralColor}
          subtitle={bpCalc ? `AHA/ACC: ${bpCalc.stage}` : 'Enter positive finite readings'}
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

              <div className="calc-preview" style={{ color: bpCalc?.color ?? neutralColor }} role="status" aria-live="polite">
                {bpCalc
                  ? `Staging: ${bpCalc.stage} (${bpCalc.status})`
                  : 'Enter finite systolic and diastolic values greater than zero to classify.'}
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
          value={glucoseCalc?.formatted ?? '—'}
          status={glucoseCalc?.status ?? 'INVALID INPUT'}
          color={glucoseCalc?.color ?? neutralColor}
          subtitle={glucoseCalc
            ? `${inputs.glucose.context.toUpperCase()}: ${glucoseCalc.category} mg/dL`
            : 'Enter a positive finite glucose reading'}
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

              <div className="calc-preview" style={{ color: glucoseCalc?.color ?? neutralColor }} role="status" aria-live="polite">
                {glucoseCalc
                  ? `Classification: ${glucoseCalc.category} (${glucoseCalc.status})`
                  : 'Enter a finite glucose value greater than zero to classify.'}
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
          value={hrCalc?.formatted ?? '—'}
          status={hrCalc?.status ?? 'INVALID INPUT'}
          color={hrCalc?.color ?? neutralColor}
          subtitle={hrCalc
            ? `PULSE: ${inputs.hr.bpm} BPM (${hrCalc.category})`
            : 'Enter a positive finite pulse'}
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

              <div className="calc-preview" style={{ color: hrCalc?.color ?? neutralColor }} role="status" aria-live="polite">
                {hrCalc
                  ? `Output: ${hrCalc.status} (${hrCalc.category})`
                  : 'Enter a finite heart rate greater than zero to classify.'}
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
          padding: 24px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(40px) saturate(130%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .ledger-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 18px;
          background: rgba(15, 23, 42, 0.5);
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
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(24px) saturate(135%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.14);
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
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(30px) saturate(140%);
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
          background: rgba(30, 41, 59, 0.5);
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
          background: linear-gradient(to right, #38bdf8, #2563eb);
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
          background: linear-gradient(to right, #7dd3fc, #3b82f6);
          box-shadow: 0 0 20px rgba(61, 90, 254, 0.4);
        }
      `}</style>
    </div>
  );
}
