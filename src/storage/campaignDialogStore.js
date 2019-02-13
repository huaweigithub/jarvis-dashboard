import { observable, action, configure } from 'mobx';

import {default as campaignApi} from 'Api/campaign';
import offerApi from 'Api/offerApi';
import landerApi from 'Api/landerApi';
import clusterApi from 'Api/clusterApi';

configure({enforceActions: 'always'});


class CampaignDialogStore {

  @observable open=false;
  @observable campaign=null;
  @observable loaded=false;
  @observable error=null;

  @observable submitting=false;
  @observable submit_error=null;

  @observable landers=[];
  @observable landers_loaded=false;
  @observable landers_error=null;

  @observable offers=[];
  @observable offers_loaded=false;
  @observable offers_error=null;

  @observable cluster=null;
  @observable cluster_loaded=false;
  @observable cluster_error=null;
  @observable successSub=false;

  // @observable customize_campaign_url = false;

  @action fetchCampaign(id, open=undefined) {
    if(open !== undefined) {
      this.open = open;
    }
    console.log(`fetching campaign ${id}, open=${open}`);
    this.error = null;
    this.loaded = false;
    this.campaign = null;

    campaignApi.get(id)
      .then(campaign => {
        this.setCampaign(campaign);
      })
      .catch(({friendly, message}) => {
        const error = friendly? message: `Unhandled error (${message})`;
        this.getCampaignFailed(error);
      });
  }

  @action openDialog(new_campaign,open=undefined){
    console.log('open dialog')
    if(open !== undefined) {
      this.open = open;
    }
    this.error = null;
    this.loaded = true;
    this.campaign = new_campaign;
    console.log('new_campaign -->',new_campaign)

  }

  @action setCampaign(campaign) {
    this.campaign = campaign;
    this.error = null;
    this.loaded = true;
  }

  @action getCampaignFailed(error) {
    this.loaded = true;
    this.error = error;
  }

  @action closeDialog() {
    // console.log('closeDialog', this);
    this.open = false;
  }

  @action initLoadLanders(updateLander) {
    if(updateLander && this.landers_loaded && !this.landers_error){
      return;
    };
    landerApi.getAll()
      .then(landers => { this.setLanders(landers) })
      .catch(({friendly,message}) => {
        const error = friendly ? message: `Unhandled error (${message})`;
        this.loadLandersFailed(error);
    })
  }

  @action setLanders(landers) {
    this.landers = landers;
    this.landers_error = null;
    this.landers_loaded = true;
  }

  @action loadLandersFailed(error){
    this.landers = [];
    this.landers_error = error;
    this.landers_loaded = true;
  }

  @action initLoadOffers(updateOffer) {
    if(updateOffer &&  this.offers_loaded && !this.offers_error) {
      return;
    };
    offerApi.getAll()
      .then(offers => { this.setOffers(offers) })
      .catch(({friendly, message}) => {
        const error = friendly? message: `Unhandled error (${message})`;
        this.loadOffersFailed(error);
    });
  }

  @action setOffers(offers) {
    this.offers = offers;
    this.offers_error = null;
    this.offers_loaded = true;
  }

  @action loadOffersFailed(error) {
    this.offers = [];
    this.offers_error = error;
    this.offers_loaded = true;
  }


  @action initLoadCluster() {
    if(this.cluster_loaded && !this.cluster_error){
      return;
    };
    clusterApi.get()
      .then(cluster => {
        this.setCluster(cluster)
       })
      .catch(({friendly,message}) => {
        const error = friendly ? message: `Unhandled error (${message})`;
        this.loadClusterFailed(error);
    })
  }

  @action setCluster(cluster){
    this.cluster = cluster;
    this.cluster_error = null;
    this.cluster_loaded = true;
  }

  @action loadClusterFailed(error) {
    this.cluster = null;
    this.cluster_error = error;
    this.cluster_loaded = true;
  }


  @action pushPath(new_path) {
    let pathes = this.campaign['pathes'].slice();

    pathes.push(new_path);
    this.campaign['pathes'] = pathes;
  }

  @action updatePathAt(index, args) {
    const old_path = this.campaign['pathes'][index];
    const new_path = {...old_path, ...args};
    this.campaign['pathes'][index] = new_path;
  }

  @action pushOffer(new_offer,index){
    let pathes = this.campaign['pathes'][index];
    pathes.offers.push(new_offer);
    console.log("pathes",pathes)
    console.log("pathes.offers", pathes.offers)
  }

  @action updateOfferAt(index, args) {
    const old_path = this.campaign['pathes'];
    old_path.map((offer)=>{
      const old_offer = offer.offers[index];
      const new_offer = {...old_offer, ...args};
      offer.offers[index] = new_offer
    })
  }

  @action pushLandr(new_lander,index){
    let pathes = this.campaign['pathes'][index];
    pathes.landers.push(new_lander);
  }

  @action updateLanderAt(index, args) {
    const old_path = this.campaign['pathes'];
    old_path.map((lander)=>{
      const old_lander = lander.landers[index];
      const new_lander = {...old_lander, ...args};
      lander.landers[index] = new_lander
    })
  }

  @action updateCampaignField(key, value) {
    this.campaign[key] = value;
  }

  @action updateCampaignCountry(key, value) {
    campaignDialogStore.campaign.conditions.map(({name,content},index) => {
      if(name=="country"){
        campaignDialogStore.campaign.conditions[index]['content'] = value;
      }
    })

  }

  @action updateCampaignPublish(key, value){
    campaignDialogStore.campaign.publish.map(({name,content},index) => {
      if(name==key){
        campaignDialogStore.campaign.publish[index] = {
          "name":name,
          "mode":value
        }
      }
    })
  }

  @action updateCampaignDevice(key, value){
    campaignDialogStore.campaign.conditions.map(({name,content},index) => {
      if(name==key){
        campaignDialogStore.campaign.conditions[index] = {
          "name":name,
          "content":value,
        }
      }
      else{
        const new_platform = {
          "name": "platform",
          "content": value
        };
        campaignDialogStore.campaign.conditions.push(new_platform);
      }
    })
  }

  @action updateCampaignRender(key, value){
    campaignDialogStore.campaign.publish.map(({name,render},index) => {
      const old_money_page = campaignDialogStore.campaign.publish[index];
      if(name=="money_page"){
        // const new_money_page = {...old_money_page}
        // console.log("campaignDialogStore.campaign.publish  new_money_page =>",new_money_page )
        campaignDialogStore.campaign.publish[index]['render'] = value
      }
      // console.log("campaignDialogStore.campaign.publish =>",campaignDialogStore.campaign.publish)
    })
  }

  @action updateCampaignPathOffersWeight(path_index,offer_weight_index,value){
    let pathes = this.campaign['pathes'][path_index];
    let offers =  pathes.offers[offer_weight_index];
    offers.weight = value
  }

  @action updateCampaignPathLandersWeight(path_index,path_lander_index,value){
    let pathes = this.campaign['pathes'][path_index];
    let landers =  pathes.landers[path_lander_index];
    landers.weight = value
  }

  @action updatePathOffer(path_index,offer_index,id){
    let pathes = this.campaign['pathes'][path_index];
    let offers =  pathes.offers[offer_index];
    offers.id = id;
  }

  @action updatePathLander(path_index,lander_index,id){
    let pathes = this.campaign['pathes'][path_index];
    let landers =  pathes.landers[lander_index];
    landers.id = id
  }

  @action setCampaignSetting(key, value) {
    campaignDialogStore.campaign.settings.map(({name, content}, index) => {
      if(name==key) {
        campaignDialogStore.campaign.settings[index] = {
          'name': name,
          'content': value
        };
      };
    });
  }

  @action setCampaiginSwitch(key, value) {
    campaignDialogStore.campaign.settings.map(({name, content}, index) => {
      if(name==key) {
        if(value == "on"){
          campaignDialogStore.campaign.settings[index] = {
            'name': name,
            'content': "off"
          };
        }else{
          campaignDialogStore.campaign.settings[index] = {
            'name': name,
            'content': "on"
          };
        }
      };
    });
  }

  @action updateCampaignPublishMoneypage(key, value) {
    // campaignDialogStore.campaign.publish.map(({name}, index) => {
    //   if(name=='money_page') {
    //     const old_money_page = campaignDialogStore.campaign.publish[index];
    //     let new_money_page = {...old_money_page};
    //     new_money_page[key] = value;
    //     campaignDialogStore.campaign.publish[index] = new_money_page;
    //   }
    // })
    let publish = campaignDialogStore.campaign.publish;
    // for(let publish; )
    for (let index = 0; index < publish.length; index++) {
      const pub = publish[index];
      const name = pub['name'];
      if(name=='money_page') {
        const old_money_page = publish[index];
        const new_money_page = {...old_money_page, ...{[key]: value}};
        // let new_money_page = {...old_money_page};
        // new_money_page[key] = value;
        // campaignDialogStore.campaign.publish[index] = new_money_page;
        publish[index] = new_money_page;
        break;
      }
    }
  }

  @action updateCampaignPublishOtherpage(key, value) {
    campaignDialogStore.campaign.publish.map(({name}, index) => {
      if(name=='other_page') {
        const old_other_page = campaignDialogStore.campaign.publish[index];
        let new_other_page = {...old_other_page};
        new_other_page[key] = value;
        campaignDialogStore.campaign.publish[index] = new_other_page;
      }
    })
  }

  @action updateCampaignPublishSafepage(key, value) {
    campaignDialogStore.campaign.publish.map(({name}, index) => {
      if(name=='safe_page') {
        const old_safe_page = campaignDialogStore.campaign.publish[index];
        let new_safe_page = {...old_safe_page};
        new_safe_page[key] = value;
        if(key == 'mode') {
          if(value == 'reverse_proxy' && (!new_safe_page['url'])) {
            new_safe_page['url'] = '';
            new_safe_page['path'] && delete new_safe_page['path'];
          };
          if(value == 'static_html' && (!new_safe_page['path'])) {
            new_safe_page['path'] = '';
            new_safe_page['url'] && delete new_safe_page['url'];
          }
        };
        // console.log('change campaign', index, 'to', new_safe_page);
        campaignDialogStore.campaign.publish[index] = new_safe_page;
      }
    });

    // console.log('key', key, 'value', value, key == 'mode', value == 'reverse_proxy');
    if(key == 'mode' && value == 'reverse_proxy') {
      let has_other_page = false;
      let new_publish = [];
      campaignDialogStore.campaign.publish.map((pub, index) => {
        const { name } = pub;
        if(name == 'other_page') {
          has_other_page = true;
        } else {
          new_publish.push(pub);
        }
      });
      if(has_other_page) {
        campaignDialogStore.campaign.publish = new_publish;
      }
      console.log("wordpress ==>",campaignDialogStore.campaign.publish)
    };

    if(key == 'mode' && value == 'static_html') {

      let has_other_page = false;
      let new_publish = [];
      campaignDialogStore.campaign.publish.map((pub, index) => {
        const { name } = pub;
        if(name == 'other_page') {
          has_other_page = true;
        };
        new_publish.push(pub);
      });
      if(!has_other_page) {
        new_publish.push({
          "root": "",
          "name": "other_page",
          "mode": "static_file"
        })
        campaignDialogStore.campaign.publish = new_publish;
      }
    }
  }

  @action updateCampaignPath(index, new_config) {
    const old_path = this.campaign.pathes[index];
    this.campaign.pathes[index] = {...old_path, ...new_config};
  }

  @action deleteCampaignPath(index) {
    this.campaign.pathes = this.campaign.pathes.filter(
      (_path, path_index) =>  path_index != index
    );
  }

  @action deleteCampaignOffer(path_index,index) {
    this.campaign.pathes[path_index].offers = this.campaign.pathes[path_index].offers.filter(
      (_offer, offer_index) =>  offer_index != index
    );
  }

  @action deleteCampaignLander(path_index,index) {
    this.campaign.pathes[path_index].landers = this.campaign.pathes[path_index].landers.filter(
      (_offer, offer_index) =>  offer_index != index
    );
  }

  @action updateSubmitStatus(args) {
    for (var key in args) {
      this[key] = args[key];
    };
  }

  @action openSweet(){
    this.successSub=true
  }

  @action closeSweet(){
    this.successSub=false
  }

  // @action setCampaignUrl(){
  //   this.customize_campaign_url = true
  // }

  @action handCampaignUrl(value){
    if(value == true){
      this.campaign.publish.map( (pub, index) => {
        const { name, mode } = pub;
        if(name == 'money_page' && mode == 'direct_link' ) {
          pub.url = this.campaign.url
        }
      })
      // this.customize_campaign_url = false
    }
    else{
      // this.customize_campaign_url = true
    }
  }
}


const campaignDialogStore = new CampaignDialogStore();

export default campaignDialogStore;
