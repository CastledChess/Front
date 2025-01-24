import { Engine, Engines } from '@/lib/analysis.ts';

export type StockfishServiceOptions = {
  enableLogs?: boolean;
  engine?: Engine;
  threads?: number;
};

/**
 * A service to interact with the Stockfish chess engine.
 */
export class StockfishService {
  private commandQueue: { command: string; callback?: (data: string) => void }[] = [];
  private worker: Worker;
  private isWorking: boolean = false;
  private isReady: boolean = false;

  /**
   * Creates an instance of StockfishService.
   *
   * @param {StockfishServiceOptions} options - Configuration options for the service.
   */
  constructor({ enableLogs = false, engine = Engines[0], threads = 1 }: StockfishServiceOptions = {}) {
    this.worker = new Worker(engine?.value);

    if (enableLogs) this.worker.addEventListener('message', (message) => console.log(message.data));
    this.worker.onmessage = (message: MessageEvent) => {
      if (message.data === 'readyok') {
        this.isReady = true;
        this.startWork();
      }
    };

    this.worker.postMessage('uci');
    this.worker.postMessage('isready');
    this.worker.postMessage('setoption name Move Overhead value 0');
    this.worker.postMessage('setoption name UCI_Elo value 3190');
    this.worker.postMessage('setoption name UCI_ShowWDL value true');

    if (engine?.isMultiThreaded) this.worker.postMessage(`setoption name Threads value ${threads}`);
  }

  /**
   * Adds a command to the queue and starts processing if not already working.
   *
   * @param {Object} command - The command to be executed.
   * @param {string} command.command - The command string to be sent to the engine.
   * @param {(data: string) => void} [command.callback] - Optional callback to handle the engine's response.
   */
  public pushCommand(command: { command: string; callback?: (data: string) => void }) {
    this.commandQueue.unshift(command);

    if (!this.isWorking && this.isReady) {
      this.isWorking = true;
      this.startWork();
    }
  }

  /**
   * Starts processing commands from the queue.
   * If the queue is empty, sets isWorking to false.
   */
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
