export class StockfishService {
  private commandQueue: { command: string; callback?: (data: string) => void }[] = [];
  private worker: Worker;
  private isWorking: boolean = false;
  private isReady: boolean = false;

  constructor(enableLogs: boolean = false) {
    this.worker = new Worker('stockfish-16.1.js');

    if (enableLogs) this.worker.addEventListener('message', (message) => console.log(message.data));
    this.worker.onmessage = (message: MessageEvent) => {
      if (message.data === 'readyok') {
        this.isReady = true;
        this.startWork();
      }
    };

    this.worker.postMessage('uci');
    this.worker.postMessage('isready');
    this.worker.postMessage('debug off');
    this.worker.postMessage('setoption name Move Overhead value 0');
    this.worker.postMessage('setoption name UCI_Elo value 3190');
    this.worker.postMessage('setoption name UCI_ShowWDL value true');
    this.worker.postMessage('setoption name Threads value 4');
  }

  public pushCommand(command: { command: string; callback?: (data: string) => void }) {
    this.commandQueue.unshift(command);

    if (!this.isWorking && this.isReady) {
      this.isWorking = true;

      this.startWork();
    }
  }

  private startWork() {
    if (this.commandQueue.length === 0) return (this.isWorking = false);

    const command = this.commandQueue.pop();

    if (!command) {
      this.isWorking = false;
      return;
    }

    this.worker.onmessage = (message: MessageEvent) => {
      if (!command.callback) {
        this.startWork();
        return;
      }

      if (!message.data) return;

      command.callback(message.data);

      if (message.data.startsWith('bestmove')) this.startWork();
    };

    this.worker.postMessage(command.command);

    if (!command.callback) {
      this.startWork();
    }
  }
}
