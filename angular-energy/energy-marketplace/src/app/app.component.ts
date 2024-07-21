import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PolkadotService } from './services/polkadot.service';
import { CommonModule } from '@angular/common';
import { MintComponent } from './components/mint/mint.component';
import { BurnComponent } from './components/burn/burn.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MintComponent, BurnComponent, TransferComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  blockHeader: any;
  address: string = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  balanceToken: number = 54.6;
  energyPrice: number = 0.2450;
  public events: any = [
    {"action": "TokensMinted", "amount":"140"},
    {"action": "TokensMinted", "amount":"30"},
    {"action": "TokensMinted", "amount":"150"},
    {"action": "TokensBurned", "amount":"160"},
    {"action": "TokensTransferred", "amount":"60"},
    {"action": "TokensBurned", "amount":"45.4"},
  ];

  private eventSubscription: Subscription | undefined;

  constructor(private polkadotService: PolkadotService) {}

  ngOnInit() {
    this.eventSubscription = this.polkadotService.events$.subscribe(
      (newEvents) => {
        this.events = [...newEvents, ...this.events]
      }
    );
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  async fetchBlockHeader() {
    
    const blockHeader = await this.polkadotService.getLatestBlockNumber();
    this.blockHeader = blockHeader;
  }
}
