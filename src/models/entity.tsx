abstract class Entity{
    static idx : number = 0;
    id: number;

    constructor(){
      this.id = Entity.idx;
      Entity.idx++;
    }

    getId(){
      return this.id;
    }
}

export default Entity;