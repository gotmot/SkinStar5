import React, { useState, useEffect, useRef } from 'react';
import { subscribeDialog } from './dialogBus';

const AppDialog = () => {
  const [dialog, setDialog] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    subscribeDialog((cfg) => {
      setInputValue(cfg.defaultValue || '');
      setDialog(cfg);
      setTimeout(() => inputRef.current?.focus(), 50);
    });
  }, []);

  if (!dialog) return null;

  const close = (result) => {
    dialog.resolve(result);
    setDialog(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (dialog.type === 'prompt') close(inputValue.trim());
      else if (dialog.type === 'confirm') close(true);
      else close(null);
    }
    if (e.key === 'Escape') close(null);
  };

  return (
    <div className="app-dialog-overlay" onClick={() => close(null)}>
      <div className="app-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="app-dialog-icon">
          {dialog.kind === 'error'
            ? '⚠️'
            : dialog.type === 'confirm'
              ? '❓'
              : dialog.type === 'prompt'
                ? '⌨️'
                : '✨'}
        </div>
        <div
          className="app-dialog-title"
          style={dialog.kind === 'error' ? { color: '#ff4d4d' } : null}
        >
          {dialog.title}
        </div>
        <div className="app-dialog-message">{dialog.message}</div>

        {dialog.type === 'prompt' && (
          <input
            ref={inputRef}
            type="text"
            className="app-dialog-input"
            placeholder={dialog.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}

        <div className="app-dialog-actions">
          {dialog.type === 'alert' ? (
            <button className="app-dialog-btn primary" onClick={() => close(null)}>
              Понятно
            </button>
          ) : (
            <>
              <button className="app-dialog-btn" onClick={() => close(null)}>Отмена</button>
              <button
                className="app-dialog-btn primary"
                onClick={() => close(dialog.type === 'prompt' ? inputValue.trim() : true)}
              >
                {dialog.type === 'confirm' ? 'Да' : 'ОК'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDialog;
