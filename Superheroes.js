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
        PasarDePagina ();
    }catch(error){
      console.log(error);
    };
  }
//Fin busqueda superheroes

async function SolicitarDeAVariosSuperHeroes(j){
  let i=j-10;
    
    const contenedor = document.getElementById ("tablaSuperheroes");
    contenedor.innerHTML="";
    const FragmentoSuperheroe= document.createDocumentFragment();

    for (i;i<j;i++){
        let result = await PedidoAPI(i); ///Llamo a pedido api, con el numero de id llama un superheroe

        const item=document.createElement ("tr"); ///Creo una fila en la tabla para el nombre y la foto
        item.innerHTML = result.id; 

        const item2 = document.createElement ("td");
        item2.innerHTML= result.name;

        item.appendChild(item2);
        FragmentoSuperheroe.appendChild(item);
       
        // console.log('respuesta JSON');
        //console.log(result); 
       // console.log('Nombre superheroe: ');
        console.log(result.name);
        contenedor.appendChild(FragmentoSuperheroe);
    }
    
}

let j;
function PasarDePagina (){
  console.log("hace algo");
  if(j==null){
    j=11;
  }else{
    j=j+10;
  }
    SolicitarDeAVariosSuperHeroes (j);
}

function DetrasDePagina (){
  console.log("hace algo");
  if(j==null || j==11){
    j=11;
  }else{
    j=j-10;
  }
    SolicitarDeAVariosSuperHeroes (j);
}

MostrarSuperheroes();