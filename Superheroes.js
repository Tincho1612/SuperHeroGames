const contenedor = document.getElementById("tablaSuperheroes");
const contenedor2 = document.getElementById("tablaSuperheroes2");

async function PedidoAPI(id) {
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
  try {
    PasarDePagina();
  } catch (error) {
    console.log(error);
  };
}
//Fin busqueda superheroes

async function SolicitarDeAVariosSuperHeroes(j) {
  let i = j - 10;

  contenedor.innerHTML = "";
  contenedor2.innerHTML = "";

  const FragmentoSuperheroe = document.createDocumentFragment();

  const requests = [];

  for (i; i < j; i++) {
    requests.push(PedidoAPI(i)); //Guarda las promesas en un array
  }

  const results = await Promise.all(requests); //Las resuelve todas juntas (Basicamente hace que sea más rapida la carga)

  results.forEach((result, i) => {
    const item = document.createElement("tr");
    item.innerHTML = `
      <td>${result.id}</td>
      <td>${result.name}</td>
      <td><img class="img-fluid rounded" src="${result.image.url}"></td>
    `;

    FragmentoSuperheroe.appendChild(item);

    if (i % 2 == 0) {
      contenedor.appendChild(FragmentoSuperheroe);
    } else {
      contenedor2.appendChild(FragmentoSuperheroe);
    }
  })
}


let j;
function PasarDePagina() {
  if (j == null) {
    j = 11;
  } else {
    j = j + 10;
  }
  SolicitarDeAVariosSuperHeroes(j);
}

function DetrasDePagina() {
  if (j == null || j == 11) {
    j = 11;
  } else {
    j = j - 10;
  }
  SolicitarDeAVariosSuperHeroes(j);
}

MostrarSuperheroes();