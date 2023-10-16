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
    //console.log(data);

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
      <td><button class="btn btn-outline-light" onclick="mostrarInfoDetallada(${result.id})">Ver mas</button></td>
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


//Logica de ventana display 

const modal = document.getElementById("myModal");
const modalContent = document.querySelector(".modal-content")

function cerrarModal() {
  modal.style.display = "none";
};

async function mostrarInfoDetallada(id) {

  data = await PedidoAPI(id);
  dataE = promedioStats(data);
  console.log(data);
  modalContent.innerHTML = ` 
    <div class="modal-header" style="display: flex; align-items: center;">
      <img src="${data.image.url}" alt="Imagen del superhéroe" class="img-fluid rounded" style="max-width: 100px;">
      <h2>${data.name}</h2>
      <p>${data.biography['full-name']}</p>
    </div>

    <div class="modal-body">
      <h3>Estadisticas:</h3>
      <h5>Promedio Estadisticas ${dataE.promedio}</h5>
      <p>Combate: ${dataE.combatValue}</p>
      <p>Durabilidad: ${dataE.durabilityValue}</p>
      <p>Inteligencia: ${dataE.intelligenceValue}</p>
      <p>Poder: ${dataE.powerValue}</p>
      <p>Velocidad: ${dataE.speedValue}</p>
      <p>Fuerza: ${dataE.strengthValue}</p>
      <br> <h5>Editorial: ${data.biography.publisher}</h5>
    </div>

    <div class="modal-footer">
      <button class="btn btn-outline-dark" onclick="cerrarModal()">Cerrar</button>
    </div>
  `

  modal.style.display = "block";

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

}

function promedioStats(data) { //Retorna un objeto con los datos de las estadisticas parseados a int y un promedio entre ellos
  const { combat, durability, intelligence, power, speed, strength } = data.powerstats;

  const combatValue = parseInt(combat) || 10;
  const durabilityValue = parseInt(durability) || 10;
  const intelligenceValue = parseInt(intelligence) || 10;
  const powerValue = parseInt(power) || 10;
  const speedValue = parseInt(speed) || 10;
  const strengthValue = parseInt(strength) || 10;

  const totalPowerstats = combatValue + durabilityValue + intelligenceValue + powerValue + speedValue + strengthValue;
  const promedio = totalPowerstats / 6;


  return {
    promedio: Math.round(promedio),
    combatValue,
    durabilityValue,
    intelligenceValue,
    powerValue,
    speedValue,
    strengthValue
  }
}