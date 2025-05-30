let warned = false;

export const suppressAntdWarning = () => {
  if (!warned) {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes('antd: compatible')) return;
      originalError.call(console, ...args);
    };
    warned = true;
  }
};