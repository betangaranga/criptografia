<template>
    <div>
        <md-card md-with-hover v-bind:style="card" >
            <md-ripple>
                <md-card-header>
                    <div class="md-title">Datos Personales</div>
                    <div class="md-subhead">UPIITA</div>
                </md-card-header>

                <md-card-content>
                    <h4>Nombre : {{nombre}}</h4>
                    <h4>Apellidos : {{apellido}}</h4>
                    <h4>Departamento : {{departamento}}</h4>
                    <h4>Puesto : {{puesto}}</h4>
                </md-card-content>

            </md-ripple>
        </md-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            card:{
                width:"50%",
                margin:"5em auto auto auto"
            }
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
