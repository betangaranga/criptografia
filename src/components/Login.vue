<template>
<div>
<div class="navbar" v-show="">
  <a href="#contact" id="gob"><img src="../assets/gobmxlogo.svg" alt=""></a>
  <a href="#home">Lupa</a>
  <a href="#news">Datos</a>
  <a href="#contact">Participa</a>
  <a href="#contact">Gobierno</a>
  <a href="#contact">Tramites</a>

</div>
  <div class="centered-container">
    <md-content class="md-elevation-3">

      <div class="title">
        <img src="../assets/ipn.png">
        <div class="md-title">UPIITA-IPN</div>
        <div class="md-body-1">Sistema de Administracion Escolar</div>
      </div>

      <div class="form">
        <md-field>
          <label>Usuario</label>
          <md-input v-model="login.email" autofocus></md-input>
        </md-field>

        <md-field md-has-password>
          <label>Password</label>
          <md-input v-model="login.password" type="password"></md-input>
        </md-field>
      </div>

      <div class="actions md-layout md-alignment-center-space-between">
        <md-button class="md-raised md-primary" @click="auth" v-bind:style="color">Iniciar Sesion</md-button>
        <md-button class="md-raised md-primary" @click="crearUsuario" v-bind:style="color">Registrarse</md-button>

      </div>

      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
      </div>

    </md-content>
    <div class="background" />
  </div>
  </div>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      color:{
                background:"#5e2129",
                color:"white"
            },
      loading: false,
      login: {
        email: "",
        password: ""
              }
    };
  },
  methods: {
    auth() {
      const boleta=this.login.email;
      const passwd=this.login.password;
        let router=this.$router
      db.collection("Students").doc(boleta).get().then(function(doc) {
if (doc.exists && doc.data().Passwd==passwd ){
          EventBus.$emit('enviado', boleta);

         router.replace('/principal')

    } 
 else{
     alert("log in incorrecto")
 }
}).catch(function(error) {
     console.log("Error getting document:", error);
});
    }
  }
};
</script>

<style lang="scss">
 .navbar {
    overflow: hidden;
    background-color: #282a2b;
    position: fixed; /* Set the navbar to fixed position */
    top: 0; /* Position the navbar at the top of the page */
    width: 100%; 
}

/* Links inside the navbar */
.navbar a {
    float: right;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}
#gob{
  float:left;
  margin: 0;
}
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 80px;
    }
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }
  .background {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
  }
  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
 }
</style>