import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PolkadotService } from '../../services/polkadot.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  toAddress: string = '';
  amount: number = 0;
  fromAddress: string = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

  constructor(private polkadotService: PolkadotService) { }

  async transferTokens() {
    try {
      await this.polkadotService.transferTokens(this.fromAddress, this.toAddress, this.amount);
      console.log('Tokens transferred successfully');
      //this.updateBalance();
    } catch (error) {
      console.error('Error transferring tokens:', error);
    }
  }
}
