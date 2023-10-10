const url = "https://superheroapi.com/api.php/3715170588728325/2";




 async function pedidoAPI(){
   try {
    const response = await fetch(url, { ///ACA DECLARO RESPONSE
      method: "GET"
    });

    if (!response.ok) { //RESPONSE ES EL NOMBRE DE LA CONSTANTE QUE GUARDO CON FETCH
      throw new Error("Error en el llamado");
    }

   /// console.log(response);

    data = await response.json(); //DECLARO DATA PARA GUARDAR LOS DATOS EN JSON Y RETORNARLOS
    console.log(data);

   // return data;

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


function pedidoAPI2(){
return new Promise ( (resolve,reject) =>{
        try {
        fetch (url,{
            method:"GET"
        });

        
            if(!response.ok){
                throw new Error ("Error en el llamado");
            }
            const data= response.json;
            console.log(data);

        }catch(error){
            console.error ("Error: ", error);
        }
    }
    )
}

pedidoAPI();
//pedidoAPI2();

async function asyncCall() {
    console.log('calling');
    try{ 
        let result = await PedidoAPI();

        console.log('respuesta JSON');
        console.log(result); 

        console.log('joke');
        console.log(result.value);
         //agregarElementos(result.value);
    }catch(error){
      console.log(error);
    };
  }