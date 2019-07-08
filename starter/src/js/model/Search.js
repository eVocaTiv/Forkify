import axios from 'axios';
import { key, proxy } from '../config';
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
        const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = (res.data.recipes);
        // console.log(this.result);
        } catch (error){
            alert(error);
        }
    }
}

// Global app controller
// API KEY : 5c527bc43aaf00d5e4abf359f4d7a672 
// URL : https://www.food2fork.com/api/search



