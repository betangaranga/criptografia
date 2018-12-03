<template>
    <div>
        <a11y-dialog id="app-dialog" app-root="#app" @dialog-ref="assignDialogRef">
            <div v-bind:style="modal">
                <h1 v-bind:style="modal" slot="title">Verificación de Firma</h1>
                <div>
                    <img src="../assets/checked.png" alt="SIN IMAGEN" v-show="paloma">
                    <img src="../assets/error.png" alt="SIN IMAGEN" v-show="tache">
                    <p v-bind:style="modal">{{mensaje_verificacion}}</p>

                </div>
            </div>
        </a11y-dialog>
        <h1 v-show="emails.length==0" v-bind:style="modal">BANDEJA VACIA</h1>

        <md-card v-bind:style="bandeja" v-for="email in emails">
            <md-card-header>
                <md-card-header-text>
                    <div class="md-title" v-show="!email.cifrado">{{email.remitente}}</div>
                     <div class="md-title" v-show="email.cifrado">Contenido Cifrado</div>
                    <div class="md-subhead" v-show="!email.cifrado">{{email.fecha_dia}}/{{email.fecha_mes}}/18</div>
                    <div class="md-subhead"> Folio {{email.id}}</div>
                </md-card-header-text>

                <md-card-media>
                    <img src="../assets/pdf.png" alt="People">
                </md-card-media>
            </md-card-header>

            <md-card-actions>
                <md-button v-show="paloma" v-bind:style="color" @click="generarPdf(email.id)">Descargar</md-button>
                <md-button v-bind:style="color" v-show="email.cifrado" @click="descifrar(email.id)">Descifrar</md-button>
                <md-button v-bind:style="color" v-show="!email.cifrado" @click="verificar(email.id)">Verificar</md-button>
            </md-card-actions>
        </md-card>

    </div>
</template>
<script>
    import pdf from '@/Plantilla'
    var RSA = require("jsrsasign");
    import {
        functions
    } from 'firebase';
    import {
        db
    } from '../main'
    export default {
        data() {
            return {
                dialog: null,
                mensaje_verificacion: "",
                rfc: localStorage.getItem("rfc"),
                private_key:localStorage.getItem("private_key"),
                color: {
                    background: "#5e2129",
                    color: "white"
                },
                bandeja: {
                    background: "white",
                    width: "50%",
                    margin: "1em auto auto auto",
                    radius: "2em"
                },
                modal: {
                    color: "#5e2129",
                    fontweight: "bold"
                },
                paloma: false,
                tache: false,
                emails: []
            }

        },
        firestore() {
            return {
                emails: db.collection("usuarios").doc(this.rfc).collection("emails")
            }
        },
        methods: {
            generarPdf(id){
            var index = this.emails.map(function (d) {
                    return d['id'];
                }).indexOf(id)
            pdf.genPDF(this.emails[index].fecha_dia, this.emails[index].fecha_mes, this.emails[index].destinatario, this.emails[index].remitente, this.emails[index].cuerpo,this.emails[index].firma)


            },
            assignDialogRef(dialog) {
                this.dialog = dialog
            },
            descifrar(id){
                 var CryptoJS = require("crypto-js");
                 var index = this.emails.map(function (d) {
                    return d['id'];
                }).indexOf(id)
                var key=RSA.KJUR.crypto.Cipher.decrypt(this.emails[index].llave_cifrada,  RSA.KEYUTIL.getKey(this.private_key))
                var bytes = CryptoJS.AES.decrypt(this.emails[index].contenido, key);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                decryptedData.cifrado=false
                db.collection("usuarios").doc(this.rfc).collection("emails").doc(id).update(decryptedData)
            },
            verificar: function (id) {
                var index = this.emails.map(function (d) {
                    return d['id'];
                }).indexOf(id)
                var sig = new RSA.KJUR.crypto.Signature({
                    "alg": "SHA1withRSA"
                });
                // initialize for signature validation
                sig.init(this.emails[index].public_key); // signer's certificate
                // update data
                const picked_t = (({
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
                }))(this.emails[index]);
                //sig.updateString(JSON.stringify(this.email.slice(-1)[0]));
                sig.updateString(JSON.stringify(picked_t))
                // verify signatur_t
                var isValid = sig.verify(this.emails[index].firma)
                if (isValid) {
                    this.paloma = true
                    this.tache = false
                    this.mensaje_verificacion = "La verificación ha sido exitosa, es seguro usar el archivo"
                    this.dialog.show()
                } else {
                    this.tache = true
                    this.paloma = false
                    this.mensaje_verificacion = "El archivo ha sido comprometido, se borrará de tu bandeja"
                    this.dialog.show()
                    db.collection("usuarios").doc(this.rfc).collection("emails").doc(this.emails[index].id).delete()
                        .
                    then(function () {
                        console.log("Borrado")
                    })
                }
            },
            llave: function () {
                //keypair=RSA.generateKeypair("RSA",2048)
                let llaves = RSA.KEYUTIL.generateKeypair("RSA", 1024).prvKeyObj
                console.log(RSA.KEYUTIL.getPEM(llaves, "PKCS8PRV"))
                console.log(llaves)

            }
        }
    }
</script>
<style>

</style>