import { Component, OnInit, QueryList, ViewChildren, computed, signal } from '@angular/core';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { ModalController } from '@ionic/angular';
import { IonRow,IonCol,IonButton, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton,IonCheckbox } from '@ionic/angular/standalone';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { PortfolioService } from 'src/app/services';
import { NftItemComponent } from './nft-item/nft-item.component';
import { NFT } from 'src/app/models';
import { CommonModule, NgClass } from '@angular/common';
import { FeatureToastComponent } from './feature-toast/feature-toast.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-collectibles',
  templateUrl: './collectibles.page.html',
  styleUrls: ['./collectibles.page.scss'],
  standalone: true,
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ bottom: '-10%' }), animate(300)]),
      transition(':leave', [animate(500, style({ bottom: '-10%' }))]),
    ]),
  ],
  imports: [
    NgClass,
    IonGrid, 
    IonButton,
    IonContent,
    IonHeader,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    PageHeaderComponent,
    MftModule,
    NftItemComponent,
    IonCheckbox,
    FeatureToastComponent,
    CommonModule,
  ]
})
export class CollectiblesPage implements OnInit {
  tableMenuOptions: string[] = ['all collections', 'listed'];
  showToast: boolean = false
  @ViewChildren('checkNfts') checkNfts: QueryList<IonCheckbox>
  public nfts = this._portfolio.nfts;
  
  public filterNft = computed(() =>this.nfts()?.filter(t => t.data.name.toLowerCase().startsWith(this.searchTerm().toLowerCase())))
  public searchTerm = signal('')
  public bulkSelection = signal([])
  constructor(private _portfolio:PortfolioService,    private _modalCtrl: ModalController) { }

  ngOnInit() {
  }
  searchNft(term){
    console.log(term);
    
    this.searchTerm.set(term)
  }
  selectNft(checkbox) {

    
    checkbox.checked = !checkbox.checked
    const checkedItems = this.checkNfts.filter(box => box.checked)
    console.log(checkedItems);
    
    this.bulkSelection.set(checkedItems)

  
    // console.log(this._bulkSelection(),checkbox,this.checkNfts);


    }

  
    async openModal(nfts: NFT[]) {
      // const modal = await this._modalCtrl.create({
      //   component: FeatureToastComponent,
      //   componentProps: { nfts },
      //   mode: 'ios',
      //   id: 'nft-toast',
      // });
      // modal.present();
    }
}