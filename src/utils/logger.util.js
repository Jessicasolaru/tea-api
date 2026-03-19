export class Logger {
  constructor(context = "APP") {
    this.context = context;
  }

  #print(method, message) {
    const formatted = `[${method.toUpperCase()}] [${new Date().toISOString()}] [${this.context}] ${message}`;
    console[method](formatted);
  }

  info(message) {
    this.#print("log", message);
  }
  warn(message) {
    this.#print("warn", message);
  }
  error(message) {
    this.#print("error", message);
  }
  debug(message) {
    this.#print("debug", message);
  }
}
