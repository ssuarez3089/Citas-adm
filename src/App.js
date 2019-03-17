import React, { useState, Fragment, useEffect } from 'react';

function Cita ({cita, index, eliminarCita}) {
  return(
        <div className="cita">
          <p>Mascota: <span>{cita.mascota}</span></p>
          <p>Dueño: <span>{cita.propietario}</span></p>
          <p>Fecha: <span>{cita.fecha}</span></p>
          <p>Hora: <span>{cita.hora}</span></p>
          <p>Sintomas: <span>{cita.sintomas}</span></p>
          <button 
          onClick={() => eliminarCita(index)}
           type="button" className="button eliminar u-full-width">
           Eliminar
           </button>
        </div>
  )

}

function Formulario ({crearCita}) {
  //es posible manejar o crear un state dentro de una funcion y con hooks ya se puede reutilizar
  //el valor inicio de esta funcion sera un objeto 

  //el state (cita) es igual al state actual
  // actualizar cita es la funcion pra  cambiar el sTATE
  const stateInicial = {
    mascota : '',
    propietario : '',
    fecha : '',
    hora : '',
    sintomas : ''
  }

  const [cita, actualizarCita] = useState(stateInicial);

  //que hace el e.target.name cuando lo llamo desde el input que dice mascota
  //tengo el metodo onChange tengo el nombre name con el metodo por lo tanto 
  //cada vez que se escribe se  actualiza el metodo actualizarState
  // con e puedo acceder al imput que escribo y de la forma que lee la mascota es gracias al name
  //debe ser igual a la propiedad que se tenga en el state
  //se toma una copia de el state o ahora lo llamo cita actual y hago el spread operator para que los demas metodos del input se mantengan
  //actualiza el state
  const actualizarState = e => {
      actualizarCita({
        ...cita,
        [e.target.name] : e.target.value
      })
  }

//pasamos el state (cita ) al componente principal
  const enviarCita = e => {
      e.preventDefault();
      console.log(cita);
      //paso el state (cita) hacia el componente principal
      crearCita(cita)
      //reinicio el state (reiniciar el form)
      actualizarCita(stateInicial)
  }

  return (
              <Fragment>
                  <h2>Crear Cita</h2>

                    <form onSubmit={enviarCita}>
                          <label>Nombre Mascota</label>
                          <input 
                            type="text" 
                            name="mascota"
                            className="u-full-width" 
                            placeholder="Nombre Mascota" 
                            onChange={actualizarState}
                            value={cita.mascota}
                          />

                          <label>Nombre Dueño</label>
                          <input 
                            type="text" 
                            name="propietario"
                            className="u-full-width"  
                            placeholder="Nombre Dueño de la Mascota" 
                            onChange={actualizarState}
                            value={cita.propietario}
                          />

                          <label>Fecha</label>
                          <input 
                            type="date" 
                            className="u-full-width"
                            name="fecha"
                            onChange={actualizarState}
                            value={cita.fecha}
                          />               

                          <label>Hora</label>
                          <input 
                            type="time" 
                            className="u-full-width"
                            name="hora" 
                            onChange={actualizarState}
                            value={cita.hora}
                          />

                          <label>Sintomas</label>
                          <textarea 
                            className="u-full-width"
                            name="sintomas"
                            onChange={actualizarState}
                            value={cita.sintomas}
                          ></textarea>

                          <button type="submit" className="button-primary u-full-width">Agregar</button>
                    </form>
            </Fragment>
  )
}

function App() {
  //usando useState retorna dos funciones en hook que estaran dentro del arreglo
  //primero state normal en este caso (cita) igual = this.state
  //funciona que actualiza el state en este caso (guardarCita) = this.setState();
  //se puede nombrar como desees en este caso mi state se llama citas
  //y la funcion que actualiza el state se llama guardarCita
  //dentro de la funcion de useState toma  el valor inicial
  //anteriormente sin hooks se hace state= { citas: } seria lo mismo
  
  //cargando citas de localStorage como state(citas) inicial si no hay nada en el localstorage pasa un arreglo vacio
  //con el ! en un principio comprobamos que si no hay nada en el localstorage si hay algo se mantiene
  //y pasa a ser la actualizacion del state 

  let citasIniciales = JSON.parse(localStorage.getItem('citas'));

    if(!citasIniciales) {
      citasIniciales = [];
    }

  const [citas, guardarCita] = useState(citasIniciales);

  //metodo para agregar las nuevas citas al state
  //cliente es el objeto pero como solo es un parametro tiene esta forma

  const crearCita = cita => {

    //toma una copia del state y agregar el nuevo cliente

    const nuevasCitas = [...citas, cita];

    //ahora para guardar en el state tomo la funcion de guardarCita y paso nuevasCitas
    guardarCita(nuevasCitas);
  }

  //elimina las citas del state
  const eliminarCita = index => {
      const nuevasCitas = [...citas];
      //.splice nos ayuda a eliminar un elemento de un arreglo toma que elemento quieres eliminar 
      //y como segundo para metro cuantos elementos se desean eliminar en este caso 1
      nuevasCitas.splice(index, 1);
      guardarCita(nuevasCitas);
  }

  //ya que componentdidMount y componentdidUpdate no se usan en hook lo reemplaza useEffect es muy similar
  
  useEffect( () => {
    let citasIniciales = JSON.parse(localStorage.getItem('citas'));

    if(citasIniciales) {
      localStorage.setItem('citas', JSON.stringify(citas));
    } else {
      localStorage.setItem('citas', JSON.stringify([]));
    }
  }, [citas] // con esto ayudamos a userEffects para que no se actulize constantemente con cualquier cambio
            //y lo coloco un arreglo para que se ejecute  citas tengan algun cambio
  )

  //cargar condicionalmente un titulo
  const titulo = Object.keys(citas).length === 0 ? 'No hay Citas' : 'Administra tus citas aquí';
  
  return (
    <Fragment>
        <h1>Administrador de Pacientes</h1>
        <div className="container">
            <div className="row">
              <div className="one-half column">
                <Formulario
                  crearCita={crearCita}
                />
              </div>
              <div className="one-half column">
                <h2>{titulo}</h2>  
                {citas.map((cita, index) => (
                  <Cita 
                    key={index}  //agregamos .map para que itere dentro de las citas
                    index={index} //siempre pasamos un key en este caso sera el index que va ser el indice del arreglo en cualquier posicion pasariamos un id pero en este caso no manejamos base de datos
                    cita={cita}   //index sera el indice actual que usaremos para eliminar citas
                    eliminarCita={eliminarCita}
                    />
                ))}
              </div>
            </div>
        </div>
    </Fragment>
  )
}

export default App;
