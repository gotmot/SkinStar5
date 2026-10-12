// Мини-шина диалогов: showAlert / showConfirm / showPrompt
let listener = null;

export const subscribeDialog = (fn) => { listener = fn; };

const emit = (config) =>
  new Promise((resolve) => {
    if (listener) {
      listener({ ...config, resolve });
    } else {
      if (config.type === 'confirm') resolve(window.confirm(config.message));
      else if (config.type === 'prompt') resolve(window.prompt(config.message, config.defaultValue || ''));
      else resolve(null);
    }
  });

// kind: 'info' (по умолчанию) | 'error' | 'success'
export const showAlert = (message, title = 'SkinStar', kind = 'info') =>
  emit({ type: 'alert', message, title, kind });

export const showConfirm = (message, title = 'Подтверждение') =>
  emit({ type: 'confirm', message, title });

export const showPrompt = (message, placeholder = '', title = 'Ввод') =>
  emit({ type: 'prompt', message, placeholder, title });
