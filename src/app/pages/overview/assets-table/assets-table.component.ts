import { CurrencyPipe, DecimalPipe, NgClass, SlicePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { IonImg, IonButton, IonIcon, IonSkeletonText, IonChip } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { AssetModalComponent } from './asset-modal/asset-modal.component';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { Token } from 'src/app/models';
import { SkeletonPhDirective } from 'src/app/shared/directives/skelaton-ph.directive';
import {tokenDummyPlaceholder, nftDummyPlaceholder, defiDummyPlaceholder, stakingDummyPlaceholder} from './table-options-helper'

@Component({
  selector: 'app-assets-table',
  templateUrl: './assets-table.component.html',
  styleUrls: ['./assets-table.component.scss'],
  standalone: true,
  imports: [
    SkeletonPhDirective,
    MftModule,
    IonImg,
    IonSkeletonText,
    CurrencyPipe,
    DecimalPipe,
    SlicePipe,
    IonButton,
    IonIcon,
    IonChip,
    NgClass
  ]
})
export class AssetsTableComponent implements OnInit {
  // token tps
  @ViewChild('balanceTpl', { static: true }) balanceTpl: TemplateRef<any> | any;
  @ViewChild('tokenOrValidatorTpl', { static: true }) tokenOrValidatorTpl: TemplateRef<any> | any;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any> | any;
  @ViewChild('redirectTpl', { static: true }) redirectTpl: TemplateRef<any> | any;
  @ViewChild('validatorBalanceTpl', { static: true }) validatorBalanceTpl: TemplateRef<any> | any;

  // nft tpls
  @ViewChild('collectionInfoTpl', { static: true }) collectionInfoTpl: TemplateRef<any> | any;
  @ViewChild('nftListTpl', { static: true }) nftListTpl: TemplateRef<any> | any;
  @ViewChild('nftOffersTpl', { static: true }) nftOffersTpl: TemplateRef<any> | any;

  // defi tpls
  @ViewChild('tokenPoolTpl', { static: true }) tokenPoolTpl: TemplateRef<any> | any;
  //@ts-ignore

  tableMenuOptions: string[] = ['Tokens', 'NFTs', 'Staking', 'DeFi'];


  constructor(
    private _portfolioService: PortfolioService,
    private _modalCtrl: ModalController,
  ) {
    addIcons({ arrowBack, arrowForward });
  }
  selectedTab = signal('tokens');
  columns = computed(() => {
    //@ts-ignore
    return this._columnsOptions[this.selectedTab().toLowerCase()]
  })
  tableData = computed(() => {
    let tableType: string = this.selectedTab().toLowerCase();

    // if(tableType === 'tokens'){
    //   return tokenDummyPlaceholder
    // }
    if (tableType === 'nfts') {
      return nftDummyPlaceholder

    }
    if (tableType === 'staking') {
      console.log(tableType);
      return stakingDummyPlaceholder
    }
    if (tableType === 'defi') {
      
      return defiDummyPlaceholder
    }
    return  this._portfolioService[tableType]()
  })

  private _columnsOptions = {}
  async ngOnInit() {

    this._columnsOptions = {
      tokens: [
        { key: 'token', title: 'Token', cellTemplate: this.tokenOrValidatorTpl, width: '40%' },
        { key: 'amount', title: 'Amount', cellTemplate: this.balanceTpl, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'price', title: 'Price', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'value', title: 'Value', width: '10%', cssClass: { name: 'ion-text-center bold-text', includeHeader: false } },
        { key: 'last-seven-days', title: 'Last 7 Days', width: '15%' }
      ],
      staking:  [
        { key: 'validator', title: 'Validator', cellTemplate: this.tokenOrValidatorTpl, width: '40%' },
        { key: 'apy', title: 'APY', width: '7%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'balance', title: 'Balance', cellTemplate: this.validatorBalanceTpl,width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'accumulatedRewards', title: 'Accumulated Rewards', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'status', title: 'Account Status',cellTemplate: this.statusTpl, cssClass: { name: 'ion-text-center', includeHeader: false }, width: '10%' },
        { key: 'link', title: 'Link', width: '7%', cellTemplate: this.redirectTpl}
      ],
      nfts: [
        { key: 'collection', title: 'Collection', cellTemplate: this.collectionInfoTpl, width: '25%' },
        { key: 'nfts', title: 'NFT', cellTemplate: this.nftListTpl, cssClass: { name: 'ion-text-left', includeHeader: true }, width: '30%' },
        { key: 'floor', title: 'Floor(SOL)', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'listed', title: 'Listed', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'offers', title: 'Offers', cellTemplate: this.nftOffersTpl, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'totalValue', title: 'Total Value', width: '15%', cssClass: { name: 'ion-text-center', includeHeader: true } }
      ],
      defi: [
        { key: 'poolTokens', title: 'Pool', cellTemplate: this.tokenPoolTpl, width: '45%' },
        { key: 'dex', title: 'DEX', width: '10%' },
        { key: 'your-liquidity', title: 'Your liquidity', width: '10%' },
        { key: 'type', title: 'Type', width: '15%' },
        { key: 'apy', title: 'APY', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
      ]

    }

  }

  eventEmitted($event: { event: string; value: any }): void {
    const token: Token = $event.value.row
    if ($event.event === 'onClick') {
      this.openModal(token)
    }
  }

  async openModal(token: Token) {
    const modal = await this._modalCtrl.create({
      component: AssetModalComponent,
      componentProps: { token },
      mode: 'ios',
      id: 'asset-modal',
    });
    modal.present();
  }
}