import Jsonp from 'jsonp'
import axios from 'axios'
export default class Axios{
    static jsonp(options){
        return new Promise((resolve,reject)=>{
            Jsonp(options.url,{
                param:'callback'
            },function(err,response){
                if(response.status==='success'){
                    resolve(response);
                }else{
                    reject(response.message);
                }
            })
        })
    }
    static ajax(options){
        return new Promise((resolve,reject)=>{
            let baseUrl='http://127.0.0.1:8080/';
            axios({
                url:options.url,
                method:options.method,
                mode:"no-cors",//跨域
                baseURL:baseUrl,
                data:options.data,
                timeout:5000,
                params:options.params||''
            }).then((response)=>{
                resolve(response.data);
            }).catch(err=>{
                console.log(err,'异常');
            })
        })
    }
}
