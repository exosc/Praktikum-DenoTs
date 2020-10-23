import { renderFileToString } from 'https://deno.land/x/dejs/mod.ts';
import { insert, select } from '../Model/Pg_model.ts';
import TSql from '../Model/sql.ts';

const home = async({response} : {response : any}) => {
    const dataTable= await select(
        [
            {text : TSql ['KtgFindAll']},
            {text : TSql ['BlogInfoFindAll']}
        ]
    );
    const html = await renderFileToString("./Views/Home.ejs", {
            data : {
                    pemrograman : dataTable [0],
                    blogInfo : dataTable[1]
            },
            subview :{
                namafile : "./Views/Blog-main.ejs",
                showjumbotron : true 
            }
        });
        response.body = new TextEncoder().encode(html);
}
const signup = async({response, request, state} : {response : any, request : any, state: any })=>{
    if(!request.hasBody){
        let SignupError : string ='';
        if((state.pesanError != undefined) && (state.pesanError !='')) {
            SignupError = state.pesanError;
        }
    const html = await renderFileToString("./Views/Home.ejs", {
        data : {
            pemrograman : await select({
                text : TSql['KtgFindInKode'],
                args : ['php', 'ts', 'js']
        }),
        blogInfo : await select ({
            text : TSql ['BlogInfoFindAll']
        }),
        statusSignup : SignupError
    },
    subview :{
        namafile : "./Views/Signup.ejs",
        showjumbotron : false
        }
    });
    response.body = new TextEncoder().encode(html);
}else{
    const body = await request.body().value;
    const parseData = new URLSearchParams(body);
    const namalengkap = parseData.get("fullname");
    const namauser = parseData.get("username");
    const pwd = parseData.get ("pswd");

    let hasil = await insert({
        text : TSql['InsUser'],
        args : [namauser, namalengkap, pwd]
    });

    if(hasil[0] == 'Sukses'){
        state.pesanError = '';
        response.body = "Sukses menyimpan data ke database";
    } else{
        state.pesanError = hasil[1];
        response.redirect('./Daftar');
    }
}
}

const kategori = async ({params, response} : {params : {id: string}, response : any}) =>{
    response.body = "ID parameter : "+params.id;
}
export { home, signup, kategori }
