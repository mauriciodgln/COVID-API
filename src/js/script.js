
// Variables

const contenedor = document.querySelector('.contenedor');
const resultado = document.querySelector('.resultado');
const formulario = document.querySelector('#formulario');
let paises = document.querySelector('#pais');
let ciudades = document.querySelector('#ciudad')
const btnBuscar = document.querySelector('#btnBuscar');
const inputBuscar = document.querySelector('#buscar');

const navegacion = document.querySelector('.navegacion');
const navMobile = document.querySelector('.nav-mobile');

// Event Listener

window.addEventListener('load', ()=>{
  obtenerDatosPais();
  formulario.addEventListener('submit', solicitarDatos);
  navMobile.addEventListener('click', desplegarMenu);
  window.addEventListener('resize', borrarClases);
  btnBuscar.addEventListener('click', desplegarBuscador);
});

// Funciones

// -- Scripts API -- //

function obtenerDatosPais() {
  // Recoger paises disponibles en la API para mostrarlos en <select>

  const url = 'https://covid-api.mmediagroup.fr/v1/cases';
  
  fetch(url)
    .then(resultado => resultado.json())
    .then(datos => {
      
      let html = '<option disabled selected value> -- Selecciona el País -- </option>';
      for(const [key] of Object.entries(datos)){
        html += `<option> ${key} </option>`;
      }
      paises.innerHTML = html;
  
    });

    paises.addEventListener('change', ()=> {
      obtenerDatosCiudad();
    });
}

function obtenerDatosCiudad() {
  // Una vez seleccionado el país, recoger las ciudades
  // y mostrarlas en el segundo <select>

  const pais = paises.value;
  const url = `https://covid-api.mmediagroup.fr/v1/cases?country=${pais}`;

  fetch(url)
    .then(resultado => resultado.json())
    .then(datos => {
      
      let html = '';
      for(const [key] of Object.entries(datos)){
        html += `<option> ${key} </option>`;
      }
      ciudades.innerHTML = html;
    });
}

function solicitarDatos(e){
  e.preventDefault();

  const pais = paises.value;
  if(pais === ''){
    mostrarError('El país es obligatorio');
    return;
  }
  consultarAPI(pais);
}

function mostrarError(mensaje){
  // Mostrar error si no se selecciona un país

  const error = document.querySelector('#error');
  if(!error){
    const divError = document.createElement('div');
    divError.classList.add('error');
    divError.setAttribute('id', 'error');
    divError.innerHTML = `
      <strong>Error!</strong>
      <p>${mensaje}</p>
    `;
    contenedor.appendChild(divError);

    setTimeout(() => {
      divError.remove();
    }, 5000);
  }
}

function consultarAPI(pais){
  // Consultar API 

  const url = `https://covid-api.mmediagroup.fr/v1/cases?country=${pais}`;

  spinner();

  setTimeout(() => {

    limpiarHTML();
    fetch(url)
      .then(resultado => resultado.json())
      .then(datos => buscarDatos(datos))
    
  }, 2000);


}

function buscarDatos(datos){
  // Recoger datos de la ubicación seleccionada

  const ciudad = ciudades.value;
  for(const [key, value] of Object.entries(datos)){
    if(ciudad === key) {
      mostrarDatos(key, value);
    }
  }
}

function mostrarDatos(key, value){
  // Mostrar datos en pantalla

  const { confirmed, deaths, updated } = value;
  const pais = paises.value;
  const respuestaAPI = document.querySelector('#respuestaAPI')
  const ubicacion = document.createElement('p');
  ubicacion.classList.add('datos');

  if(key === 'All'){
    ubicacion.innerHTML = `Ubicación: ${pais}`;

  } else {
    ubicacion.innerHTML = `Ubicación: ${key}, ${pais}`;
  }

  if(!respuestaAPI){
    const divResultados = document.createElement('div');
    divResultados.setAttribute('id', 'respuestaAPI');

    const casosConfirmados = document.createElement('p');
    casosConfirmados.classList.add('datos');
    casosConfirmados.innerHTML = `Casos confirmados: ${confirmed}`;

    const muertes = document.createElement('p');
    muertes.classList.add('datos');
    muertes.innerHTML = `Muertes: ${deaths}`;

    const actualizacion = document.createElement('p');
    actualizacion.classList.add('datos');

    if(updated === undefined){
      actualizacion.innerHTML = `Ultima actualización: No disponible`;

    } else {
      actualizacion.innerHTML = `Ultima actualización: ${updated}`;
    }

    divResultados.appendChild(ubicacion);
    divResultados.appendChild(casosConfirmados);
    divResultados.appendChild(muertes);
    divResultados.appendChild(actualizacion);

    resultado.appendChild(divResultados);
  }

}

function limpiarHTML(){
  // Limpia sección 'resultado' cada que se van a mostrar los resultados

  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
  }
}

function spinner(){

  limpiarHTML();
  const spinnerHTML = document.createElement('p');
  spinnerHTML.classList.add('datos')
  spinnerHTML.innerHTML = 'Buscando...';
  resultado.appendChild(spinnerHTML);
  
}


// -- Scripts página -- //

function desplegarMenu(){
  efectoNavMobile();
  navegacion.classList.toggle('activo')
}

function efectoNavMobile(){
  navMobile.classList.toggle('activo')
}

function borrarClases(){
  // Eliminar clases 'activo' al ser pantalla mayor a 768px
  if(window.innerWidth > 768){
    navegacion.classList.remove('activo');
    navMobile.classList.remove('activo');
    inputBuscar.classList.remove('activo');
  }
}

function desplegarBuscador(e){
  e.preventDefault();

  if(window.innerWidth < 768){
    inputBuscar.classList.toggle('activo');
  }
}