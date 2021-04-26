
const firebase =  require("firebase");
require("firebase/firestore");
require("firebase/auth");
const { remote } = require("electron");
const main = remote.require("./main");
const fs = require("fs-extra");
const exec = require("child_process").execFile;
const btn = document.querySelector("#installer");
const progress = document.querySelector("#progess");
const txtArea = document.querySelector("#textArea");
const lengthSerials = document.querySelector("#lengthSerials");
const firebaseConfig = {
  apiKey: "AIzaSyB4o-VBuLj94DBb9h2vlm_-XmYBCPA1AAI",
  authDomain: "compety-desktop-01.firebaseapp.com",
  databaseURL: "https://compety-desktop-01.firebaseio.com",
  projectId: "compety-desktop-01",
  storageBucket: "compety-desktop-01.appspot.com",
  messagingSenderId: "1034659816125",
  appId: "1:1034659816125:web:4a35acda798af14e4d8dd4",
  measurementId: "G-Y6D9NXM4LG",
};

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

btn.addEventListener("click", (e) => {
  
  btn.disabled = true;
  progress.style.display ="flex";

  if(lengthSerials.value == 0 || lengthSerials.value == "" ){
    alert("Necesita agregar la cantida de seriales a generar");
   
  }else{
    MakeSerials((data) => {
    
      UploadSerial(data).then((newSerials) => {
        textArea.value = newSerials.join("\n");
    progress.style.display ="none";
    btn.disabled = false;
    alert("Seriales Generadas correctamente.")
  
  
      });
    });
  }
  
});

const MakeSerials = (callback) => {
  let data = [];
  const count = 0;
  for (let index = 0; index < lengthSerials.value; index++) {
    if (count >= lengthSerials.value) {
      
    } else {
      data.push(generate(16,""));
    }
  }
  callback(data);
};

const UploadSerial = (serials) => {
  return new Promise(async (resolve, reject) => {
    firebase
      .auth()
      .signInWithEmailAndPassword("competydev@gmail.com", "XEVvn2OKRdc8iP9")
      .then(async (res) => {
        let newSerials = [];
        for (let index = 0; index < serials.length; index++) {

          newSerials.push(serials[index]);

          const usRef = await firebase
            .firestore()
            .collection("serials")
            .doc(serials[index]);
          const doc = await usRef.get();

          if (doc.exists) {
            continue;
          } else {

            firebase.firestore().collection("serials").doc(serials[index]).set({
              created: firebase.firestore.FieldValue.serverTimestamp(),
              use: 0,
            });

          }
         
        }

        resolve(newSerials);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert(
          "Se genero un error, por favor compruebe su conexion a internet y vuelva a intentarlo. " +
            errorMessage
        );
        reject();
      });
  });
};

const oneRandomKey = function () {
  return Math.random()
  .toString(36)
  .toUpperCase()
  .slice(2)
  .replace(/[01IO]/g, '')
}

const randomKeyOfSpecificLength = function (len) {
  let str = oneRandomKey()
  while (str.length < len) {
    str += oneRandomKey()
  }
  return str.slice(0, len)
}

const generate = function (length = 16, separator = '-', blockLength = 4) {
  const license = randomKeyOfSpecificLength(length)
  const regexp = new RegExp(`(\\w{${blockLength}})`, 'g')
  return license.replace(regexp, `$1${separator}`).substr(0, (length + Math.round(length / blockLength)) - 1)
}