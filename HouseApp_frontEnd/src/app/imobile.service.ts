import { Injectable } from '@angular/core';
import {imobil} from './post/case';
import {CASES} from './mock-case';

@Injectable({
  providedIn: 'root'
})
export class ImobileService {

  constructor() { }

  getCase():imobil[]{
    return CASES;
  }

  getCasaById(id){
    let b=null;
    
      for(let i=0;i<CASES.length;i++)
      {
	      if( CASES[i].id === id)
          b=CASES[i];		
      }

      return b;
  }

  
  getCasaByOdd(id):imobil[]{//ce tip de return are functia

    let c:imobil[]=[];

   for(let i=id%2 ;i<CASES.length;i+=2)
   {
       c.push(CASES[i]);
    }
    return c;
  }

}

