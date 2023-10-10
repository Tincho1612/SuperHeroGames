 async function PedidoAPI(id){
    let url = `https://superheroapi.com/api.php/3715170588728325/${id}`; //Al no haber una url q llame a todos (o no encontre), hago cada una en el metodo especifico
  
    try {
    const response = await fetch(url, { ///ACA DECLARO RESPONSE
      method: "GET"
    });

    if (!response.ok) { //RESPONSE ES EL NOMBRE DE LA CONSTANTE QUE GUARDO CON FETCH
      throw new Error("Error en el llamado");
    }

   /// console.log(response);

    data = await response.json(); //DECLARO DATA PARA GUARDAR LOS DATOS EN JSON Y RETORNARLOS
   // console.log(data);

    return data;

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

///Fin llamado Api por Id

//Inicio busqueda superheroes
async function MostrarSuperheroes() {
    console.log('Llamando...');
    try{ 
        let i=1;
        SolicitarDeA20SuperHeroes(i);

         //agregarElementos(result.value);
    }catch(error){
      console.log(error);
    };
  }
//Fin busqueda superheroes

async function SolicitarDeA20SuperHeroes(i){
    let j=i+20;
    for (i;i<j;i++){
        let result = await PedidoAPI(i); ///Llamo a pedido api, con el numero de id llama un superheroe

       // console.log('respuesta JSON');
        //console.log(result); 

       // console.log('Nombre superheroe: ');
        console.log(result.name);
    }
}

MostrarSuperheroes();