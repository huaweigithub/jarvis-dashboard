import { observable, action, configure } from 'mobx';


configure({enforceActions: 'always'});


class TieListPaginationStore {

  @observable current_page=1;
  @observable total_page=1;
  @observable limit=50;
  @observable loaded=false;
  @observable error=null;
  @observable ties=[];
  @observable loading=false;

  @action fetchTiesPage(page = 1) {
    this.error = null;
    this.loaded = false;
    this.current_page = page;
    console.log(`fetching ties from page ${page}`);

    const limit = this.limit;
    const offset = (page - 1) * limit;
    const promise = new Promise((resolve, reject) => {
      return tieListCache.fetchTieList(offset, limit, resolve, reject);
    });
    promise
      .then(
        (api_result) => {  // succeed
          const { total, limit, ties } = api_result;

          const page_mod = total % limit;
          const page_div = Math.trunc(total / limit);
          let total_page = page_div;
          if(page_div == 0) {
            total_page = 1;
          } else if (page_mod != 0) {
            total_page = page_div + 1;
          };

          this.apiResult({
            loaded: true,
            error: null,
            ties: ties,
            limit: limit,
            current_page: page,
            total_page: total_page,
          })
        },
        (error_msg) => {  // failed
          this.apiResult({
            loaded: true,
            error: error_msg,
          })
        }
      )
      .catch(
        (error) => {
          console.log(error);
          this.apiResult({
            loaded: true,
            error: error,
          })
        }
      );
  }

  @action apiResult({loaded=true, error=null, ties=[], limit=50, current_page=1, total_page=1}) {
    this.loaded = loaded;
    this.error = error;
    this.ties = ties;
    this.limit = limit;
    this.current_page = current_page;
    this.total_page = total_page;
  }

}


const tieListPaginationStore = new TieListPaginationStore();

export default tieListPaginationStore;