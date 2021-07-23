
export class RandoData {  
    totalCapacityRemaining: number;
    totalType: Map<string, number>;
    constructor(t: number, tt: Map<string, number>){
      this.totalCapacityRemaining = t;
      if(tt){
        this.totalType = new Map(tt);
      }
    }  
  
    totalTypeRemaining(type: string){
      var value = this.totalType.get(type);
      // console.info(`${type}, ${value}`);
      return this.totalType.get(type);
    }
  
    updateData(type: string){
      let val = this.totalType.get(type) - 1;    
      this.totalType.set(type, val);  
      this.totalCapacityRemaining--;
    }
  
    private _allTypesSatisfied: boolean = false;
    get allTypesSatisfied(){
      if(!this._allTypesSatisfied){    
        for(var type of this.totalType.keys()){
          var typeRemaining = this.totalType.get(type);
          if(typeRemaining > 0)
            return false;
        }
      }
  
      this._allTypesSatisfied = true;
      return true;
    }
}
  