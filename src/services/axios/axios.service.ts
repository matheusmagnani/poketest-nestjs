import { Injectable } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class AxiosService {
  get(name: string){
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

  }
}