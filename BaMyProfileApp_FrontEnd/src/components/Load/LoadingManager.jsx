class LoadingManager {
    constructor() {
      this.show = null;
      this.hide = null;
    }
  
    setCallbacks(show, hide) {
      this.show = show;
      this.hide = hide;
    }
  
    show(message) {
      if (this.show) {
        this.show(message);
      }
    }
  
    hide() {
      if (this.hide) {
        this.hide();
      }
    }
  }
  
  export const loadingManager = new LoadingManager();
  