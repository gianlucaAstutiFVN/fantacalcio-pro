// Middleware per gestire la coda delle richieste al database
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.maxConcurrent = 1; // SQLite funziona meglio con una sola operazione alla volta
  }

  async add(operation) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        operation,
        resolve,
        reject
      });
      
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const { operation, resolve, reject } = this.queue.shift();
      
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      // Piccola pausa tra le operazioni per ridurre i conflitti
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

// Middleware per serializzare le operazioni al database
const queueMiddleware = (req, res, next) => {
  // Aggiungi il metodo queue alla response per operazioni serializzate
  res.queueOperation = async (operation) => {
    return requestQueue.add(operation);
  };
  
  next();
};

module.exports = {
  queueMiddleware,
  requestQueue
};
