import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PolkadotService } from '../../services/polkadot.service';

@Component({
  selector: 'app-burn',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './burn.component.html',
  styleUrl: './burn.component.scss'
})
export class BurnComponent {
  amount: number = 0;
  address: string = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Replace with actual account address

  constructor(private polkadotService: PolkadotService) { }

  async burnTokens() {
    try {
      await this.polkadotService.burnTokens(this.address, this.amount);
      console.log('Tokens burned successfully');
      //this.updateBalance();
    } catch (error) {
      console.error('Error burning tokens:', error);
    }
  }
}
