import { Injectable } from '@angular/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolkadotService {
  private api!: ApiPromise;
  private eventsSubject = new Subject<any>();
  public events$: Observable<any> = this.eventsSubject.asObservable();

  constructor() {
    this.init();
  }

  async init() {
    try {
      const provider = new WsProvider('ws://127.0.0.1:9944');
      this.api = await ApiPromise.create({provider});
      console.log('API initialized successfully');
    } catch (error) {
      console.error('Error initializing API:', error);
    }
  }

  async getLatestBlockNumber(): Promise<number> {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    try {
      const header = await this.api.rpc.chain.getHeader();
      return header.number.toNumber();
    } catch (error) {
      console.error('Error fetching latest block number:', error);
      throw error;
    }
  }

  async getAccountBalance(accountId: string): Promise<any> {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    try {
      // Convert account ID to Uint8Array
      const accountUint8Array = this.api.createType('AccountId', accountId);

      // Query account data
      const accountData = await this.api.query['system']['account'](accountUint8Array);

      // Extract free balance
      //const balance = accountData.data.free.toBigInt();

      return accountData;
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  private subscribeEvents() {
    if (this.api) {
      const FILTERED_EVENTS = [
        'system:ExtrinsicSuccess::(phase={"applyExtrinsic":0})',
      ];

      const eventName = (ev: any) => `${ev.section}:${ev.method}`;
      const eventParams = (ev: any) => JSON.stringify(ev.data);

      this.api.query['system']['events']((events: any) => {
        const processedEvents = events
          .filter((record: any) => {
            const { event, phase } = record;
            const evHuman = event.toHuman();
            const evNamePhase = `${eventName(evHuman)}::(phase=${phase.toString()})`;
            return !FILTERED_EVENTS.includes(evNamePhase);
          })
          .map((record: any, index: number) => {
            const { event } = record;
            const evHuman = event.toHuman();
            return {
              key: index,
              icon: 'bell',
              summary: eventName(evHuman),
              content: eventParams(evHuman),
            };
          });

        this.eventsSubject.next(processedEvents);
      });
    }
  }

  async mintTokens(account: string, amount: number): Promise<void> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      console.log('tx:', this.api.tx["energySystem"]);
      const tx = this.api.tx['energyToken']['mintTokens'](amount);
      await tx.signAndSend(account);
    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  async burnTokens(account: string, amount: number): Promise<void> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      const tx = this.api.tx['energyToken']['burnTokens'](amount);
      await tx.signAndSend(account);
    } catch (error) {
      console.error('Error burning tokens:', error);
      throw error;
    }
  }

  async transferTokens(from: string, to: string, amount: number): Promise<void> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      const tx = this.api.tx['energyToken']['transferTokens'](to, amount);
      await tx.signAndSend(from);
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  async getTokenBalance(account: string): Promise<any> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      const balance = await this.api.query['energyToken']['energyTokenBalance'](account);
      return balance;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }
}
