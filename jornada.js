import {traerConsulta,guardarRegistro} from './firebase.js'


//llamando a la funcion traer consulta que incluye la tabla grid js
const boton     =document.getElementById('boton');
let acumulador  = document.getElementById('acumulador')


boton.addEventListener('click',async(e)=>{
  e.preventDefault()
  
  let nombre      = document.getElementById('employed_id').value
  
  const querySnapshot = await traerConsulta(nombre)

  
  

  const objetos       =[]
  const nombreDia     = (entrada)=>{const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];return nombreDia[new Date(entrada).getDay()]}
  const lapsoMiliseg   = (entrada,salida)=>{return (new Date(salida).getTime())-(new Date(entrada).getTime())}    //calculamos los milisegundos transcurridos por diferencia
  const lapsoHoras    = (entrada,salida)=>{return lapsoMiliseg(entrada,salida)/(1000*60*60)}                  //los milisegundos lo convertimos a horas
  const minutosEnteros= (entrada,salida)=>{return (lapsoHoras(entrada,salida)*(60))%(60)}         //la hora lo convertimos a minutos x60 y sacamos su modulo o residuo de minutos
  const horasEnteras  = (entrada,salida)=>{return lapsoHoras(entrada,salida)-minutosEnteros(entrada,salida)/60}
  const horasDecimales = (entrada,salida)=>{return horasEnteras(entrada,salida) + (Math.round((minutosEnteros(entrada,salida)/60)*100))/100}
  const horasMinutos= (entrada,salida)=>{return `${Math.round(Number(horasEnteras(entrada,salida)))}:${minutosEnteros(entrada,salida).toFixed(0)}`}
  
  let index           =0
  let horasAcumuladas =0


  querySnapshot.forEach((doc) => {
    console.log('datos:',doc);
    objetos.push(doc.data());
    objetos[index]['dia']=nombreDia(doc.data().input_work);//renombrandos los datos traidos firebase
    objetos[index]['entrada']=doc.data().input_work
    objetos[index]['salida_']=doc.data().output_work
    objetos[index]['horas']=horasMinutos(doc.data().input_work,doc.data().output_work);

   
    index +=1; 
    horasAcumuladas  +=horasDecimales(doc.data().input_work,doc.data().output_work)
  })


  let acumulador = document.getElementById('acumulador')
  acumulador.innerHTML=horasAcumuladas.toFixed(2)

  
  
  
  new gridjs.Grid({data:objetos}).render(document.getElementById('table'));
 
})



//para guaradr los registo en firebase
const tareaForm = document.getElementById('form1')
tareaForm.addEventListener('submit',(e)=>{
  e.preventDefault()

  const input_work        = tareaForm['input_work'].value;
  const output_work        = tareaForm['output_work'].value;
  const employed_id   = tareaForm['employed_id'].value;
  let status       = false;

  guardarRegistro(employed_id.trim(),input_work,output_work,status)

  tareaForm.reset()
})