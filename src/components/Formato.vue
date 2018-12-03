<template>
  <div>
    <a11y-dialog id="app-dialog" app-root="#app" @dialog-ref="assignDialogRef">
            <div v-bind:style="modal">
                <h1 v-bind:style="modal" slot="title">Mensaje enviado con exito :)</h1>
                <div>
                    <p v-bind:style="modal">{{mensaje_verificacion}}</p>

                </div>
            </div>
        </a11y-dialog>
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
            <md-option v-for="destinatario in destinatarios" v-bind:style="opcion" v-bind:value="destinatario.nombre">{{destinatario.nombre}}</md-option>
          </md-select>
        </md-field>
        <md-field>
          <label>Cuerpo del Formato</label>
          <md-textarea v-model="cuerpoTexto" md-autogrow></md-textarea>
        </md-field>

      </md-card-content>

      <md-card-actions>
        <md-button v-bind:style="color" @click="generarPdf()">Vista Previa</md-button>
        <md-button v-bind:style="color" @click="enviar()">Enviar Formato</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>
<script>
  import pdf from '@/Plantilla'
  import {
    db
  } from '../main'
  import {
    functions
  } from 'firebase';
  import jsPDF from 'jspdf'
  var RSA = require("jsrsasign");
  var d = new Date()
  var fecha = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear()
  export default {
    data() {
      return {
        rfc: localStorage.getItem("rfc"),
        remitente: localStorage.getItem("nombre"),
        public_remitente: localStorage.getItem("public_key"),
        private_remitente: localStorage.getItem("private_key"),
        email: [],
        cifrar: true,
        color: {
          background: "#5e2129",
          color: "white"
        },
        opcion: {
          zindex: "-1",
          background: "white"
        },
        card: {
          width: "50%",
          height: "100%",
          margin: "3em auto auto auto"
        },
        modal: {
                    color: "#5e2129",
                    fontweight: "bold"
                },
        cuerpoTexto: "",
        destinatario_rfc: "",
        destinatario_public: "",
        destinatario: "",
        contenido_cifrado: "",
        llave_cifrado: "",
        destinatarios: [],
        mensaje_verificacion:""


      }
    },
    firestore() {
      db.collection("usuarios").get()
        .then(snap => {
          snap.forEach(doc => {
              this.destinatarios.push({
                nombre: doc.data().nombre
              })
            }

          )
        })

    },

    methods: {
       assignDialogRef(dialog) {
                this.dialog = dialog
            },
      agregarUsuario: function () {
        let llaves = RSA.KEYUTIL.generateKeypair("RSA", 512)
        db.collection("usuarios").doc("RFC2").update({
          private_key: RSA.KEYUTIL.getPEM(llaves.prvKeyObj, "PKCS8PRV"),
          public_key: RSA.KEYUTIL.getPEM(llaves.pubKeyObj),

        })
      },
      setEmail: function () {
        console.log(this.destinatario)
        this.email.push({
          cifrado: this.cifrar,
          destinatario: this.destinatario,
          cuerpo: this.cuerpoTexto,
          fecha_dia: d.getDate(),
          fecha_mes: d.getMonth()+1,
          remitente: this.remitente,
          public_key: this.destinatario_public //aqui va llave publica de quien recibe el email
        })
        //console.log(this.email.slice(-1)[0].public_key)

      },
      firmarEmail: function () {

        var sig = new RSA.KJUR.crypto.Signature({
          "alg": "SHA1withRSA"
        });
        // initialize for signature generation
        //console.log(this.email.slice(-1)[0].private_key)
        sig.init(this.private_remitente); // rsaPrivateKey of RSAKey object
        // update data
        const picked = (({
          cuerpo,
          destinatario,
          fecha_dia,
          fecha_mes,
          remitente,
          public_key,
          private_key
        }) => ({
          cuerpo,
          destinatario,
          fecha_dia,
          fecha_mes,
          remitente,
          public_key,
          private_key
        }))(this.email.slice(-1)[0]);

        sig.updateString(JSON.stringify(picked))
        // calculate signature
        var sigValueHex = sig.sign()
        this.email.slice(-1)[0].firma = sigValueHex

      },
      convertBytesToHex : function (bytes) {
        // Grabbed from https://github.com/ricmoo/aes-js
        var result = [];
        var Hex = '0123456789abcdef';

        for (var i = 0; i < bytes.length; i++) {
          var v = bytes[i];
          result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
        }

        return result.join('');
      },
      encriptar: function () {
        var encryptionKey = window.crypto.getRandomValues(new Uint8Array(8));
        var CryptoJS = require("crypto-js");
        encryptionKey = CryptoJS.enc.Hex.parse(this.convertBytesToHex(encryptionKey));
        this.llave_cifrado = RSA.KJUR.crypto.Cipher.encrypt(encryptionKey.toString(), RSA.KEYUTIL.getKey(this.email.slice(-1)[0].public_key))
        this.contenido_cifrado = CryptoJS.AES.encrypt(JSON.stringify(this.email.slice(-1)[0]),encryptionKey.toString()).toString();


      },
      setDestinatario() {
        db.collection("usuarios").where("nombre", "==", this.destinatario).get().
        then(snapshot => {
          snapshot.forEach(doc => {
            this.destinatario_rfc = doc.data().rfc
          })
        })
      },
      enviar: function () {
        //this.setDestinatario()
        this.setEmail()
        this.firmarEmail()
        if (this.email.slice(-1)[0].cifrado) {
          this.encriptar()
          db.collection("usuarios").doc(this.destinatario_rfc).collection("emails").add({
            contenido: this.contenido_cifrado,
            llave_cifrada: this.llave_cifrado,
            cifrado: true

          })
          .then(doc=>{
        this.mensaje_verificacion="Mensaje cifrado enviado con id : "+" "+doc.id
          })
        } else {
          db.collection("usuarios").doc(this.destinatario_rfc).collection("emails").add(this.email.slice(-1)[0])
          .then(doc=>{
        this.mensaje_verificacion="Mensaje enviado con id  "+" "+doc.id
          })
        }
        this.dialog.show()
        //this.generarPdf()
        //console.log(this.email)


      },
      generarPdf: function () {
        this.setDestinatario()
        this.setEmail()
        this.firmarEmail()
        console.log(this.email.slice(-1)[0])
        pdf.genPDF(d.getDate(), d.getMonth()+1, this.destinatario, this.remitente, this.cuerpoTexto, this.email.slice(-
          1)[0].firma)
      }
    },
    watch: {
      destinatario: function () {
        db.collection("usuarios").where("nombre", "==", this.destinatario).get().
        then(snapshot => {
          snapshot.forEach(doc => {
            this.destinatario_rfc = doc.data().rfc
            this.destinatario_public = doc.data().public_key
          })
        })

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