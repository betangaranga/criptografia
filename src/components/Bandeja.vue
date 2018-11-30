<template>
    <div>
        <md-card v-bind:style="bandeja" v-for="email in emails">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{email.remitente}}</div>
          <div class="md-subhead">{{email.fecha}}</div>
        </md-card-header-text>

        <md-card-media>
          <img src="../assets/pdf.png" alt="People">
        </md-card-media>
      </md-card-header>

      <md-card-actions>
        <md-button v-bind:style="color" v-show="email.cifrado">Descifrar</md-button>
        <md-button v-bind:style="color">Verificar</md-button>
        <md-button v-bind:style="color" @click="llave">Descargar</md-button>
      </md-card-actions>
    </md-card>

    </div>
</template>
<script>
var RSA = require("jsrsasign");

export default {
    data(){
        return{
            color:{
                background:"#5e2129",
                color:"white"
            },
            bandeja:{
                background:"white",
                width:"50%",
                margin:"1em auto auto auto",
                radius:"2em"
            },
            emails:[
                {
                remitente:"Pedro Ferriz",
                fecha:"29/02/2018",
                cifrado:true
                 },
                 {
                     remitente:"Roberto Fernández",
                     fecha:"25/01/2015",
                     cifrado:false
                 },
                 {
                     remitente:"Gabriel Rodriguez",
                     fecha:"27/77/2018",
                     cifrado:true
                 }
            ]
        }
        
    },
    methods:{
        llave:function(){
           //keypair=RSA.generateKeypair("RSA",2048)
           let llaves=RSA.KEYUTIL.generateKeypair("RSA",1024).prvKeyObj
        console.log(RSA.KEYUTIL.getPEM(llaves, "PKCS8PRV"))
        console.log(llaves)

        }
    }
}
</script>
<style>
</style>
