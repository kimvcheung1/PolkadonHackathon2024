import { Component } from '@angular/core';
import { PolkadotService } from '../../services/polkadot.service';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent {
  balance: number = 0;
  address: string = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  
  constructor(private polkadotService: PolkadotService) { }

  ngOnInit(): void {
    this.loadBalance();
  }

  async loadBalance() {
    //this.balance = await this.polkadotService.getBalance(this.address);
  }
}
