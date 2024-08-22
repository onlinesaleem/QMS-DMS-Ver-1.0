export class QualityResponseModal {

     incId :number;
     notes:string;
    finalActionTaken:string;
    ifNotAppropriate:string;

    constructor(incId:number,
        notes:string,finalActionTaken:string,ifNotAppropriate:string){
            this.incId=incId;
            this.finalActionTaken=finalActionTaken;
            this.ifNotAppropriate=ifNotAppropriate;
            this.notes=notes;


    }

}