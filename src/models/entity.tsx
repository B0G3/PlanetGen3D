abstract class Entity{
    static idx : number = 0;
    id: number;

    constructor(){
      this.id = Entity.idx;
      Entity.idx++;
    }
}

export default Entity;