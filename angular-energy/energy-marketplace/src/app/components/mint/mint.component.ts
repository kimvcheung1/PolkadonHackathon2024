import { Component } from '@angular/core';
import { PolkadotService } from '../../services/polkadot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mint.component.html',
  styleUrl: './mint.component.scss'
})
export class MintComponent {
  amount: number = 0;
  address: string = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Replace with actual account address

  constructor(private polkadotService: PolkadotService) { }

  async mintTokens() {
    try {
      await this.polkadotService.mintTokens(this.address, this.amount);
      console.log('Tokens minted successfully');
      //this.updateBalance();
    } catch (error) {
      console.error('Error minting tokens:', error);
    }
  }
}
