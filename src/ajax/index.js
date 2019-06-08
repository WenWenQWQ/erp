export default class Ajax{
    static userInfo(){
        return new Promise((resolve,reject)=>{
            fetch('/userInfo',{
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                credentials:'include',
                mode:"cors",
            }).then(
                res=>res.json()
            ).then(data=>{
                if(data!==''){
                    resolve(data);
                }else{
                    reject()
                }
            })
        })
    }
}