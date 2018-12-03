<template>
    <div>
        <md-card md-with-hover v-bind:style="card" >
            <md-ripple>
                <md-card-header>
                    <div class="md-title">Datos Personales</div>
                    <div class="md-subhead">UPIITA</div>
                </md-card-header>

                <md-card-content>
                    <h4>Nombre : {{datos.nombre}}</h4>
                    <h4>Departamento : {{datos.departamento}}</h4>
                    <h4>Puesto : {{datos.cargo}}</h4>
                </md-card-content>

            </md-ripple>
        </md-card>
    </div>
</template>
<script>
import { functions } from 'firebase';
import { db } from '../main'
export default {
    data(){
        return{
            rfc:localStorage.getItem("rfc"),
            datos:[],
            card:{
                width:"50%",
                margin:"5em auto auto auto"
            }
        }
    },
    firestore(){
            return{
                datos:db.collection("usuarios").doc(this.rfc)
            }
    }
}
</script>
<style>
h4{
    font-weight: bold;
    color:#5e2129
}
</style>
