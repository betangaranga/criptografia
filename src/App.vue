<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet">
    <router-view/>
  </div>
</template>
<script>
import firebase from 'firebase'

export default {
  mounted() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.js')
    document.head.appendChild(recaptchaScript)
  },
}
</script>

<style>
#app {
font-family: 'Quicksand', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #722f37;
}

#nav a.router-link-exact-active {
  color: #722f37;
}
</style>
