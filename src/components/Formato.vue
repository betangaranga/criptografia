<template>
    <div>
        <md-card v-bind:style="card" style="border-radius=2em">
      <md-card-header>
        <div class="md-title">Envio Seguro de Formatos Oficiales</div>
      </md-card-header>

      <md-card-content>
        <label>
    <input type="checkbox" class="option-input checkbox" v-model="cifrar" checked />
    Cifrar Formato
  </label>  
<md-field>
          <label for="movie">Seleccionar Destinatario</label>
          <md-select v-model="destinatario" v-bind:style="opcion" name="destinatario">
            <md-option v-for="destinatario in destinatarios" v-bind:style="opcion" v-bind:value="destinatario.nombre" >{{destinatario.nombre}}</md-option>
          </md-select>
        </md-field>
    <md-field>
      <label>Cuerpo del Formato</label>
      <md-textarea v-model="cuerpoTexto" md-autogrow></md-textarea>
    </md-field>

      </md-card-content>

      <md-card-actions>
         <md-button  v-bind:style="color" @click="generarPdf()">Vista Previa</md-button>
        <md-button  v-bind:style="color" @click="enviar()">Enviar Formato</md-button>
      </md-card-actions>
    </md-card>
    </div>
</template>
<script>
import jsPDF from 'jspdf'
var RSA = require("jsrsasign");
var d=new Date()
var fecha=d.getDate()+'/'+ d.getMonth()+'/'+ d.getFullYear()
export default {
    data(){
        return{
          email:[],
            cifrar:true,
            color:{
                background:"#5e2129",
                color:"white"
            },
            opcion:{
                zindex:"-1",
                background:"white",
                     },
            card:{
                width:"50%",
                height:"100%",
                margin:"3em auto auto auto"
                },
                cuerpoTexto:"",
                destinatario:"",
                destinatarios:[
                    {
                        nombre:"Roberto"
                    },
                    {
                        nombre:"Alberto"
                    },
                    {
                        nombre:"Leon"
                    },
                    {
                        nombre:"Gabriel"
                    },
                    {
                        nombre:"John"
                    },
                    {
                        nombre:"Miguel"
                    }
                ]
        }
    },
    methods:{
      setEmail:function(){
let llaves=RSA.KEYUTIL.generateKeypair("RSA",1024).prvKeyObj
          this.email.push({
            //se escribe arreglo en base de datos
            cifrado:this.cifrar,
            destinatario:this.destinatario,
            cuerpo:this.cuerpoTexto,
            fecha:fecha,
            private_key:RSA.KEYUTIL.getPEM(llaves, "PKCS8PRV")//se tiene que obtener de la base de datos, porque ya estará generada
          })
      },
        enviar:function(){
         
//GENERACIÓN DE LLAVES
          this.setEmail()
          this.generarPdf
        console.log(this.email)

        },
        generarPdf:function(){
          this.setEmail()
var doc = new jsPDF();
doc.setFont("helvetica");
doc.setFontType("bold");
doc.setFontSize(9);
doc.text(JSON.stringify(this.email), 10, 10);
doc.text(JSON.stringify(this.email), 10, 40);

console.log(this.email)
doc.save(this.destinatario+fecha + '.pdf');
        }
    }
}
</script>
<style>
.md-radio {
    display: flex;
  }
  @keyframes click-wave {
  0% {
    height: 40px;
    width: 40px;
    opacity: 0.35;
    position: relative;
  }
  100% {
    height: 200px;
    width: 200px;
    margin-left: -80px;
    margin-top: -80px;
    opacity: 0;
  }
}

.option-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  position: relative;
  top: 13.33333px;
  right: 0;
  bottom: 0;
  left: 0;
  height: 40px;
  width: 40px;
  transition: all 0.15s ease-out 0s;
  background: #cbd1d8;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.5rem;
  outline: none;
  position: relative;
  z-index: 1000;
}
.option-input:hover {
  background: #9faab7;
}
.option-input:checked {
  background: #5e2129;
}
.option-input:checked::before {
  height: 40px;
  width: 40px;
  position: absolute;
  content: '✔';
  display: inline-block;
  font-size: 26.66667px;
  text-align: center;
  line-height: 40px;
}
.option-input:checked::after {
  -webkit-animation: click-wave 0.65s;
  -moz-animation: click-wave 0.65s;
  animation: click-wave 0.65s;
  background: #40e0d0;
  content: '';
  display: block;
  position: relative;
  z-index: 100;
}
.option-input.radio {
  border-radius: 50%;
}
.option-input.radio::after {
  border-radius: 50%;
}
</style>
