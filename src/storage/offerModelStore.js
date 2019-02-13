import { observable, action, configure } from 'mobx';

import offerApi from 'Api/offerApi';


configure({enforceActions: 'always'});


class OfferModelStore {

  @observable open=false;
  @observable offer=null;
  @observable loaded=false;
  @observable error=null;

  @observable submitting=false;
  @observable submit_error=null;
  @observable successSub=false;

  @action fetchOffer(id, open = undefined) {
    if(open !== undefined) {
      this.open = open;
    };
    offerApi.get(id)
      .then(offer => {
        this.setOffer(offer);
      })
      .catch(result => {
        this.setLoadFailed(result);
      });
  }

  @action setOffer(offer) {
    this.offer = offer;
    this.error = null;
    this.loaded = true;
  }

  @action setLoadFailed({friendly, message}) {
    this.offers = null;
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action openModal() {
    this.open = true;
  }
 
  @action closeModal() {
    this.open = false;
    this.offer = null;
    this.loaded = false;
  }

  @action updateOfferField(key, value) {
    this.offer[key] = value;
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

}


const offerModelStore = new OfferModelStore();

export default offerModelStore;
